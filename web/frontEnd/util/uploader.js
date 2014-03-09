/**
 *	@author bh-lay
 *	@github https://github.com/bh-lay/uploader
 *  @updata 2014-3-9 21:2
 * 
 */
window.util = window.util || {};
/**
 * until.drag(handle_dom,dom,fn);
 */
(function uploaderClosure(exports){
	var staticID = 0;
	var upCnt_tpl = ['<div class="uploaderCnt"></div>'].join('');
	var up_tpl = ['<div class="uploaderItem uploader{ID}">',
		'<iframe id="uploader{ID}" name="uploader{ID}" width="0" height="0" marginwidth="0" frameborder="0" src="about:blank"></iframe>',
		'<form method="post" action="{action}" enctype="multipart/form-data" name="uploader" target="uploader{ID}">',
			//请选择图片
			'<input name="{fileinputname}" type="file" multiple="multiple" class="uploader_btn" title="\u8BF7\u9009\u62E9\u56FE\u7247"/>',
		'</form>',
	'</div>'].join('');
	
	var up_css = ['<style type="text/css" data-module="birthday">',
		'.uploaderCnt{width:0px;height:0px;position:absolute;left:0px;top:0px;z-index:1000000;}',
		'.uploaderItem{position:absolute;overflow:hidden;}',
		'.uploader_btn{position:absolute;width:200%;height:100%;top:0px;right:0px;',
			'opacity:0;filter:Alpha(opacity=0);cursor:pointer}',
	'</style>'].join('');
	//创建工作环境
	var global_cnt = $(upCnt_tpl);

	$('body').append(global_cnt);
	$('head').append(up_css);
	
	
	//iframe加载
	function iframe_load(iframe,load){
		if (iframe.attachEvent){
			iframe.attachEvent("onload", function(){
				load&&load.call(iframe.contentDocument);
			});
		}else{
			iframe.onload = function(){
				load&&load.call(iframe.contentDocument);
			};
		}
	}
	//获取文件信息
	function getFilesFromInput(input){
		var returns = [];
		if(input.value.length > 0){
			if(input.files){ 
				for(var i=0,total=input.files.length;i<total;i++){
					returns.push({
						'name' : input.files[i]['name'],
						'size' : input.files[i]['size']
					})
				}
			}else{
				returns.push({
					'name' : input.value.split(/\\/).pop()
				});
			}
		}
		return returns;
	}
	//初始化单次上传模块
	function initSingleUp(uploaderDom,btn,ID,this_up){
				//	alert(uploaderDom.parent()[0].tagName);
		//事件处理
		var inputDom = uploaderDom.find('.uploader_btn');
		var iframe = uploaderDom.find('iframe')[0];
		
		//悬停事件
		function overFn(){
			var cur_btn = $(this);
			var offset = cur_btn.offset();
			cur_btn.addClass('hover');
			uploaderDom.css({
				'top' : offset.top,
				'left' : offset.left,
				'width' : cur_btn.outerWidth(),
				'height' : cur_btn.outerHeight(),
				'display' : 'block'
			});
		}
		//为按钮绑定悬停事件
		btn.mouseenter(overFn);
		
		uploaderDom.on('mouseleave',function(){
			uploaderDom.hide();
			btn.removeClass('hover')
			btn.removeClass('active');
		}).on('mousedown',function(){
			btn.removeClass('hover')
			btn.addClass('active');
		}).on('mousemove',function(e){
			var oW = uploaderDom.width();
			var oL = uploaderDom.offset().left;
			var mL = e.pageX;
			inputDom.css('right',oL+oW-mL-25);
		}).on('change','.uploader_btn',function(){
			var ipt = this;
			//检测是否已选择文件
			var files = getFilesFromInput(ipt);
			if(files.length > 0){
				//触发上传前事件
				this_up.emit('beforeUpload',[ID,files]);
				if(this_up.can_upload){
					btn.unbind('mouseover',overFn);
					uploaderDom.hide();
					//开始上传文件
					$(this).parents('form').submit();
					//触发上传事件
					this_up.emit('startUpload',[ID,files]);
				}else{
					ipt.outerHTML = ipt.outerHTML;
				}
			}
		});
		iframe_load(iframe,function(){
			var responseTXT = this.body.innerHTML;
			//去除部分浏览器自动添加的标签
			responseTXT = responseTXT.replace(/<[^>]+>|<\/[^>]+>/g,'');
			//移除上传模块dom
			uploaderDom.remove();
			//未定义格式化数据，直接退出计算
			if(!this_up.responseParser){
				return
			}
			//尝试去解析
			try{
				var jsonData = eval('(' + responseTXT + ')');
				//数据交由开发者格式化
				var parserData = this_up.responseParser(jsonData);
				//console.log(2,parserData);

				if(typeof(parserData) != 'object'){
					this_up.emit('fail',[ID]);
					return
				}
				//console.log(3);
				if(parserData['files'] && parserData['files']['length'] > 0){
					//console.log(4);
					this_up.emit('success',[
						ID,
						parserData['files'],
						parserData['extra']
					]);
				}else{
					//console.log(5);
					this_up.emit('fail',[
						ID,
						parserData['extra']
					]);
				}
			}catch(e){
				this_up.emit('fail',[
					ID,
					'\u670D\u52A1\u5668\u6570\u636E\u5F02\u5E38\uFF01'//服务器数据异常！
				]);
			}
			
		});
	}
	//构造新的单次上传模块
	function createSingleUp(){
		var ID = ++staticID;
		var this_up = this;
		var action = this.action;
		var btn = this.dom;
		var fileinputname = this.fileinputname;

		//创建新的html
		var html = up_tpl.replace(/{(\w*)}/g,function(){
			var key = arguments[1];
			if(key == 'ID'){
				return ID
			}else if(key == 'action'){
				return action
			}else if(key == 'fileinputname'){
				return fileinputname
			}
		});
		var uploaderDom  = $(html);
		
	//	$('body').append(uploaderDom);
		global_cnt.append(uploaderDom);
		
		/**
		 * 这个定时器是为了处理IE7异步创建iframe的BUG
		 * 如果你有好的办法，请  mail:bh_lay@126.com
		 */
		setTimeout(function(){
			initSingleUp(uploaderDom,btn,ID,this_up);
		},100);
	}
	
	////

	function uploader(param){
		var this_up = this;
		//事件堆
		this.events = {};
		this.action = param['action'] || null;
		//绑定上传方法的DOM
		this.dom = param['dom'];
		this.fileinputname = param['fileinputname'] || 'photos';
		//是否可上传
		this.can_upload = true;
		this.responseParser = param['responseParser'] || null;
		
		this.on('startUpload',function(){
			createSingleUp.call(this_up);
		});
		//为了提供异步接口，创建此定时器
		setTimeout(function(){
			createSingleUp.call(this_up);
		},50);
	}
	uploader.prototype = {
		'on' : function (eventName,callback){
			//事件堆无该事件，创建一个事件堆
			if(!this.events[eventName]){
				this.events[eventName] = [];
			}
			this.events[eventName].push(callback);
			return this;
		},
		'emit' : function (eventName,args){
			//事件堆无该事件，结束运行
			if(!this.events[eventName]){
				return
			}
			args = args || null;
			for(var i=0,total=this.events[eventName].length;i<total;i++){
				this.events[eventName][i].apply(this.event_global || this , args);
			}
		},
		'destory' : function(){
			//FIXME
		}
	};
	exports.uploader = uploader;
})(window.util);


//提供CommonJS规范的接口
define && define(function(require,exports,module){
	//对外接口
	return window.util.uploader;
});