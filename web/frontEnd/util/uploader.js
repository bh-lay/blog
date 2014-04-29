/**
 *	@author bh-lay
 *	@github https://github.com/bh-lay/uploader
 *  @updata 2014-4-28 15:46
 * 
 */
window.util = window.util || {};

(function(exports){
	var staticID = 0;
	var upCnt_tpl = ['<div class="uploaderCnt" style="width:0px;height:0px;position:fixed;left:0px;top:0px;overflow:hidden"></div>'].join('');
	var up_tpl = ['<div class="uploaderItem uploader{ID}">',
		'<iframe id="uploader{ID}" name="uploader{ID}" width="0" height="0" src="about:blank"></iframe>',
		'<form method="post" action="{action}" enctype="multipart/form-data" name="uploader" target="uploader{ID}">',
			//请选择图片
			'<input name="{fileinputname}" type="file" multiple="multiple" class="uploader_btn" title="\u8BF7\u9009\u62E9\u56FE\u7247"/>',
			'{data}',
		'</form>',
	'</div>'].join('');
	
	var input_tpl = '<input type="hidden" name="{name}" value="{value}" />';
	
	//创建工作环境
	var global_cnt = $(upCnt_tpl);

	$('body').append(global_cnt);
	var private_isSupportTouch = "ontouchend" in document ? true : false;
	
	//iframe加载事件监听方法
	function iframe_load(iframe,callback){
		if (iframe.attachEvent){
			iframe.attachEvent("onload", function(){
				callback&&callback.call(iframe.contentDocument);
			});
		}else{
			iframe.onload = function(){
				callback&&callback.call(iframe.contentDocument);
			};
		}
	}
	//创建新的html
	function buildDom(){
		var this_up = this;
		
		//组装data对象对应的input
		var data_html = '';
		var data = this.data;
		for(var i in data){
			data_html += input_tpl.replace(/{(\w*)}/g,function(result,key){
				if(key == 'name'){
					return i;
				}else if(key == 'value'){
					return data[i]
				}
			});
		}
		//初始化上传配置
		var html = up_tpl.replace(/{(\w*)}/g,function(result,key){
			if(key == 'ID'){
				return this_up.ID
			}else if(key == 'action'){
				return this_up.action
			}else if(key == 'fileinputname'){
				return this_up.fileinputname
			}else if(key == "data"){
				return data_html;
			}
		});
		return $(html);
	}
	/**
	 * 获取文件信息 
	 */
	function getFilesFromInput(input){
		var returns = [];
		
		if(input.value.length > 0){
			//有文件选中
			if(input.files){
				//可多选 
				for(var i=0,total=input.files.length;i<total;i++){
					returns.push({
						'name' : input.files[i]['name'],
						'size' : input.files[i]['size']
					})
				}
			}else{
				//不支持多选
				returns.push({
					'name' : input.value.split(/\\/).pop()
				});
			}
		}
		return returns;
	}
	//格式化JSON
	function parseJSON(input){
		//去除部分浏览器自动添加的标签
		input = input.replace(/<[^>]+>|<\/[^>]+>/g,'');
		var output = {};
		//尝试去解析
		try{
			output = eval('(' + input + ')');
		}catch(e){
			output = 'fail';
		}
		return output;
	}
	/**
	 * 单次上传类
	 */
	function SingleUp(param){
		var this_up = this;
		this.ID = ++staticID;
		this.action = param.action;
		this.data = param['data'] || {};
		
		//状态 等待上传|上传中
		//    wait | uploading
		this.status = 'wait';
		this.responseParser = param['responseParser'] || null;
		this.fileinputname = param['fileinputname'] || 'photos';
		//事件集
		this.beforeUpload = param.beforeUpload || null;
		this.onStartUpload = param.onStartUpload || null;
		this.onFail = param.onFail || null;
		this.onSuccess = param.onSuccess || null;
		
		this.dom = buildDom.call(this);
		
		global_cnt.append(this.dom);
		
		/**
		 * 这个定时器是为了处理IE7浏览器异步创建iframe，导致无法立即得到iframe的BUG
		 * 如果你有好的办法，请  mail:bh_lay@126.com
		 */
		setTimeout(function(){
			this_up.init();
		},100);
	}
	//销毁自己
	SingleUp.prototype['destory'] = function(){
		if(this.status == 'wait'){
			this.dom.remove();
		}else{
			this.dom.hide();
		}
	};
	//处理response
	SingleUp.prototype['handleResponse'] = function(responseTXT){
		var ID = this.ID;
		this.status = 'wait';
		//是否已格式化数据方法
		if(this.responseParser){
			var jsonData = parseJSON(responseTXT);
			if(jsonData == 'fail'){
				//服务器数据异常！
				this.onFail && this.onFail(ID,'\u670D\u52A1\u5668\u6570\u636E\u5F02\u5E38\uFF01');
			}else{
				//数据交由开发者格式化
				var parserData = this.responseParser(jsonData);
				
				if(typeof(parserData) != 'object'){
					this.onFail && this.onFail(ID);
				}else{
					if(parserData['files'] && parserData['files']['length'] > 0){
						this.onSuccess && this.onSuccess(ID,parserData['files'],parserData['extra']);
					}else{
						this.onFail && this.onFail(ID,parserData['extra']);
					}
				}
			}
		}else{
			this.onFail && this.onFail(ID,'you need define method : responseParser! ');
		}
		//销毁单次上传模块
		this.destory();
	}
	//初始化单次上传模块
	SingleUp.prototype['init'] = function(){
		var this_up = this;
		
		var uploaderDom = this.dom;
		var iframe = this.dom.find('iframe')[0];
		var ID = this.ID;
		//事件处理
		uploaderDom.on('change','.uploader_btn',function(){
			var input = this;
			var can_start = true;
			//检测是否已选择文件
			var files = getFilesFromInput(input);
			if(files.length > 0){
				//触发上传前事件
				if(this_up.beforeUpload){
					can_start = this_up.beforeUpload(ID,files);
				}else{
					can_start = true;
				}
				if(can_start){
					uploaderDom.hide();
					//开始上传文件
					$(this).parents('form').submit();
					this_up.status = 'uploading';
					//触发上传事件
					this_up.onStartUpload && this_up.onStartUpload(ID,files);
				}else{
					//重置html
					input.outerHTML = input.outerHTML;
				}
			}
		});
		iframe_load(iframe,function(){
			var responseTXT = this.body.innerHTML;
			this_up.handleResponse(responseTXT);
		});
	};
	
	/**
	 * @method uploader 上传类
	 * @param {Object} param 主参数
	 * 
	 */

	function uploader(param){
		var this_up = this;
		//事件堆
		this._events = {};
		this.action = param['action'] || null;
		this.data = param['data'] || {};
		//绑定上传方法的DOM
		this.dom = param['dom'];
		this.fileinputname = param['fileinputname'] || 'photos';
		//是否可上传
		this.can_upload = true;
		this.responseParser = param['responseParser'] || null;
		
		//当前激活状态的上传组建
		this.activeSet = null;
		
		//创建一个上传组建
		function workStart(){
			var btn = $(this);
			this_up.createSingleUp(btn);
		}
		
		if(this.dom[0].addEventListener && private_isSupportTouch){
			//移动端使用touch
			this.dom.each(function(){
				var DOM = $(this)[0];
				DOM.addEventListener('touchstart',workStart);
				DOM.addEventListener('MSPointerDown',workStart);
				DOM.addEventListener('pointerdown',workStart);
			});
		}else{
			//PC为按钮绑定悬停事件
			this.dom.mouseenter(workStart)
		}
		
		this.dom.mouseleave(function(){
			//注销上传组建
			this_up.activeSet && this_up.activeSet.destory();
		}).on('click',function(){
			//代理click事件至上传组建
			this_up.activeSet.dom.find('.uploader_btn').trigger('click');
		});
	}
	uploader.prototype = {
		'on' : function (eventName,callback){
			//事件堆无该事件，创建一个事件堆
			if(!this._events[eventName]){
				this._events[eventName] = [];
			}
			this._events[eventName].push(callback);
			return this;
		},
		'emit' : function (eventName,args){
			//事件堆无该事件，结束运行
			if(!this._events[eventName]){
				return
			}
			args = args || null;
			for(var i=0,total=this._events[eventName].length;i<total;i++){
				this._events[eventName][i].apply(this.event_global || this , args);
			}
		},
		'createSingleUp' : function(){
			var this_up = this;
			this.activeSet = new SingleUp({
				'action' : this.action,
				'data' : this.data,
				'responseParser' : this.responseParser,
				'beforeUpload' : function(ID,files){
					this_up.emit('beforeUpload',[ID,files]);
					if(this_up.can_upload){
						return true;
					}else{
						return false;
					}
				},
				'onStartUpload' : function(ID,files){
					this_up.emit('startUpload',[ID,files]);
				},
				'onSuccess' : function(ID,files,extra){
					this_up.emit('success',[ID,files,extra]);
				},
				'onFail' : function(ID,extra){
					this_up.emit('error',[ID,extra]);
				}
			});
		}
	};
	exports.uploader = uploader;
})(window.util);

//提供CommonJS规范的接口
window.define && define(function(require,exports,module){
	//对外接口
	return window.util.uploader;
});