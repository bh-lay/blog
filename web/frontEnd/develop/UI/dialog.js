/**
 * @author bh-lay
 * 
 * @github https://github.com/bh-lay/UI
 * @modified 2014-9-28 10:9
 * 
 **/

(function(global,doc,UI_factory,utils_factory){
	
	//初始化工具类
	var utils = utils_factory(global,doc);
	
	//初始化UI模块
	var UI = UI_factory(global,doc,utils);
	
	//提供window.UI的接口
	global.UI = global.UI || UI;
	global.UI._utils = utils;
	
	//提供CommonJS规范的接口
	global.define && define(function(){
		return UI;
	});
})(window,document,function(window,document,utils){
	/**
	 * 缓存utils下常用工具
	 *   为压缩变量名做准备
	 */
	var isNum = utils.isNum,
		setCSS = utils.css,
		getCSS = utils.getStyle,
		animation = utils.animation,
		outerWidth = utils.outerWidth,
		outerHeight = utils.outerHeight,
		findByClassName = utils.findByClassName,
		bindEvent = utils.bind;
	
	/**
	 * 基础模版
	 */
	var allCnt_tpl = '<div class="UI_lawyer"><div class="UI_mask"></div></div>',
		pop_tpl = '<div class="UI_pop"><div class="UI_pop_cpt"></div><div class="UI_cnt"></div><a href="javascript:;" class="UI_pop_close" title="\u5173\u95ED">×</a></div>',
		confirm_tpl = '<div class="UI_confirm"><div class="UI_confirm_text"><%=text %></div></div>',
		ask_tpl = '<div class="UI_ask"><div class="UI_ask_text"><%=text %></div><input class="UI_ask_key" type="text" name="UI_ask_key"/></div>',
		confirmBar_tpl = '<div class="UI_pop_confirm"><a href="javascript:;" class="UI_pop_confirm_ok"><%=confirm %></a><a href="javascript:;" class="UI_pop_confirm_cancel"><%=cancel %></a></div>',
		plane_tpl = '<div class="UI_plane"></div>',
		prompt_tpl = '<div class="UI_prompt"><div class="UI_cnt"></div></div>',
		cover_tpl = '<div class="UI_cover"><div class="UI_cnt"></div><a href="javascript:;" class="UI_close UI_coverClose">×</a></div>',
		select_tpl = '<div class="UI_select"><div class="UI_select_body UI_cnt"><% if(title){ %><div class="UI_selectCpt"><h3><%=title %></h3><% if(intro){ %><p><%=intro %></p><% } %></div><% } %><div class="UI_selectCnt"><% for(var i=0,total=list.length;i<total;i++){ %><a class="UI_select_btn" href="javascript:;"><%=list[i] %></a><% } %></div></div><div class="UI_selectCancel"><a class="UI_select_btn" href="javascript:;">取消</a></div></div>',
		popCSS = '.UI_lawyer{position:absolute;top:0;left:0;z-index:4999;width:100%;height:0;overflow:visible;font-family:"Microsoft Yahei"}.UI_lawyer a,.UI_lawyer a:hover,.UI_lawyer a:active{outline:none;text-decoration:none;-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-tap-highlight-color:transparent}.UI_mask{position:absolute;top:0;left:0;width:100%;height:100%;background:#000;display:none;opacity:0.6;filter:alpha(opacity=60)}.UI-blur{-webkit-transition:0.08s;-webkit-filter:blur(3px)}.UI_pop{width:200px;position:absolute;top:400px;left:300px;background:#fff;box-shadow:2px 3px 10px rgba(0,0,0,0.6)}.UI_pop_cpt{position:relative;height:36px;line-height:36px;overflow:hidden;border-bottom:1px solid #ebebeb;color:#777;font-size:16px;text-indent:15px;cursor:default}.UI_pop .UI_cnt{position:relative;min-height:100px;overflow:auto}.UI_pop_close{display:block;position:absolute;top:0;right:0;width:40px;height:36px;text-align:center;color:#ddd;font:bold 20px/36px "simsun";transition:0.1s}.UI_pop_close:hover{color:#888}.UI_pop_close:active{color:#222}.UI_confirm{width:300px;position:absolute;background:#fff;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6)}.UI_confirm_text{padding:30px 10px 20px;line-height:26px;text-align:center;font-size:20px;color:#333}.UI_ask{width:300px;position:absolute;background:#fff;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6)}.UI_ask_text{padding:25px 10px 15px;line-height:26px;text-align:center;font-size:18px;color:#333}.UI_ask input{display:block;margin:0 auto 15px;height:30px;padding:4px 4px;line-height:22px;box-sizing:border-box;width:90%}.UI_pop_confirm{overflow:hidden;text-align:center;border-top:1px solid #ddd;white-space:nowrap}.UI_pop_confirm a{display:inline-block;width:50%;font-size:14px;line-height:36px;color:#03f;transition:0.15s}.UI_pop_confirm a:hover{background:#eee}.UI_pop_confirm_ok{border-right:1px solid #ddd}.UI_plane{width:200px;position:absolute;top:400px;left:300px}.UI_prompt{position:absolute;width:240px;background:#fff;box-shadow:2px 2px 10px rgba(0,0,0,0.5)}.UI_prompt .UI_cnt{padding:30px 10px;font-size:18px;color:#333;text-align:center}.UI_cover{position:absolute;top:0;width:100%;height:100px;max-width:100%}.UI_cover .UI_cnt{position:relative;width:100%;height:100%;background:#fff;overflow:auto}.UI_coverClose{display:block;position:absolute;top:10px;right:20px;width:30px;height:30px;text-align:center;color:#aaa;font:18px/30px "simsun";background:#eee;border-radius:15px;border:1px solid #aaa}.UI_coverClose:hover{background:#333;color:#fff;transition:0.2s}.UI_select{position:absolute;width:200px;box-shadow:2px 2px 2px rgba(0,0,0,0.6)}.UI_select a{display:block;height:40px;line-height:40px;text-align:center;color:#03f;font-size:16px}.UI_select_body{overflow:hidden;background:#fff}.UI_selectCpt{padding:8px 0}.UI_selectCpt h3,.UI_selectCpt p{margin:0;font-size:15px;line-height:18px;text-align:center;color:#aaa;font-weight:normal}.UI_selectCpt p{font-size:12px}.UI_selectCnt a{height:34px;line-height:34px;font-size:14px;border-top:1px solid #ddd}.UI_selectCnt a:hover{background:#eee}.UI_selectCancel{display:none}@media(max-width:640px){.UI_select{position:fixed;bottom:0;width:100%;padding-bottom:10px}.UI_select_body, .UI_selectCancel{margin:0 10px;border-radius:8px}.UI_select_body{margin:0 10px 10px}.UI_selectCancel{display:block;background:#fff}.UI_lawyer a:hover{background:none}}.UI_ie678 .UI_pop,.UI_ie678 .UI_confirm,.UI_ie678 .UI_ask,.UI_ie678 .UI_prompt,.UI_ie678 .UI_select{outline:3px solid #ccc}';
	
	var isIE67 = isIE678 = false;
	if(navigator.appName == "Microsoft Internet Explorer"){
		var version = navigator.appVersion.split(";")[1].replace(/[ ]/g,"");
		if(version == "MSIE6.0" || version == "MSIE7.0"){
			isIE67 = true;
			isIE678 = true;
		}else if(version == "MSIE8.0"){
			isIE678 = true;
		}
	}
	
	/**
	 * 定义私有变量
	 * 
	 **/ 
	var private_allCnt = utils.createDom(allCnt_tpl)[0],
		private_maskDom = findByClassName(private_allCnt,'UI_mask')[0],
		private_body = document.body,
		private_docW,
		private_winH,
		private_docH,
		private_scrollTop;

	var private_CONFIG = {
		'gap' : {
			'top' : 0,
			'left' : 0,
			'bottom' : 0,
			'right' : 0
		},
		'zIndex' : 499
	};
	var docDom;
	if (document.compatMode == "BackCompat") {
		docDom = private_body;
	}else{
		//"CSS1Compat"
		docDom = document.documentElement;
	}
	function refreshSize(){
		//重新计算窗口尺寸
		private_scrollTop = docDom.scrollTop == 0 ? private_body.scrollTop : docDom.scrollTop;
		private_winH = window.innerHeight || document.documentElement.clientHeight;
		private_docH = docDom.scrollHeight;
		private_docW = docDom.clientWidth;
	}
	
	
	//初始化组件基础功能
//	utils.ready(function(){
		//插入css样式表
		var styleSheet = utils.createStyleSheet(popCSS,{'data-module' : "UI"});
		
		//插入基础dom
		private_body.appendChild(private_allCnt);
		
		//释放掉无用的内存
		popCSS = null;
		allCnt_tpl = null;
		
		//更新窗口尺寸
		refreshSize();
		setTimeout(refreshSize,500);
		
		if(isIE678){
			utils.addClass(private_allCnt,'UI_ie678');
		}
		
		var rebuild_fn = null;
		if(isIE67){
			rebuild_fn = function(){
				refreshSize();
				setCSS(private_maskDom,{
					'marginTop' : private_scrollTop
				});
			};
		}else{
			setCSS(private_maskDom,{
				'position' : 'fixed',
				'top' : 0
			});
			rebuild_fn = refreshSize;
		}
		
		//监听浏览器缩放、滚屏事件
		bindEvent(window,'resize',rebuild_fn);
		bindEvent(window,'scroll',rebuild_fn);
//	});
	
	//限制位置区域的方法
	function fix_position(top,left,width,height){
		var gap = private_CONFIG.gap;
		if(top<private_scrollTop + gap.top){
			//屏幕上方
			top = private_scrollTop  + gap.top;
		}else if(top + height - private_scrollTop > private_winH - gap.bottom) {
			//屏幕下方
			if(height > private_winH - gap.top - gap.bottom){
				//比屏幕高
				top = private_scrollTop + gap.top;
			}else{
				//比屏幕矮
				top = private_scrollTop + private_winH - height - gap.bottom;
			}
		}
		if(left < gap.left){
			left =  gap.left;
		}else if(left + width > private_docW - gap.right){
			left = private_docW - width - gap.right;
		}
		
		return {
			'top' : Math.ceil(top),
			'left' : Math.ceil(left)
		}
	}
	//设置dom自适应于页面
	function adaption(dom,param,time){
		var param = param ||{},
			width = outerWidth(dom),
			height = outerHeight(dom),
			top = (private_winH - height)/2 + private_scrollTop,
			left = (private_docW - width)/2,
			newPosition = fix_position(top,left,width,height),
			method = setCSS;
		if(isNum(time)){
			method = animation;
		}
		method(dom,{
			'top' : isNum(param.top) ? param.top : Math.ceil(newPosition.top),
			'left' : isNum(param.left) ? param.left : Math.ceil(newPosition.left)
		},time);
	}
	
	//增加确认方法
	function add_confirm(dom,param,close){
		var callback = null;
		var cancel = null;
		var btns = ['\u786E\u8BA4','\u53D6\u6D88'];
		if(typeof(param) == "function"){
			callback = param;
		}else if(typeof(param) == "object"){
			var paramBtns = param.btns || [];
			btns[0] = paramBtns[0] || btns[0];
			btns[1] = paramBtns[1] || btns[1];
			if(typeof(param.callback) == "function"){
				callback = param.callback;
			}
			if(typeof(param.cancel) == "function"){
				cancel = param.cancel;
			}
		}
		var this_html = utils.render(confirmBar_tpl,{
			'confirm' : btns[0],
			'cancel' : btns[1]
		});
		dom.appendChild(utils.createDom(this_html)[0]);
		
		//绑定事件，根据执行结果判断是否要关闭弹框
		bindEvent(dom,'click','.UI_pop_confirm_ok',function(){
			//点击确认按钮
			callback ? ((callback() != false) && close()) : close();
		});
		bindEvent(dom,'click','.UI_pop_confirm_cancel',function(){
			//点击取消按钮
			cancel ? ((cancel() != false) && close()) : close();
		});
	}
	
	/**
	 * 处理对象易于关闭的扩展
	 *   点击自身以外 or 按下esc
	 */
	 //当前打开状态的对象
	private_active = [];
	//关闭最上一个
	function closeActive(){
		var item = null;
		while(1){
			item = private_active.pop();
			if(!item || !item.dead){
				break
			}
		}
		item && item.close();
	}
	//检测body的mouseup事件
	bindEvent(private_body,'mouseup',function checkClick(event) {
		var target = event.srcElement || event.target;
		setTimeout(function(){
			while (!utils.hasClass(target,'UI_easyClose')) {
				target = target.parentNode;
				if(!target){
					closeActive();
					break
				}
			}
		});
	});
	//检测window的keydown事件（esc）
	bindEvent(private_body,'keyup',function checkClick(event) {
		if(event.keyCode == 27){
			closeActive();
		}
	});
	
	/**
	 * 对象易于关闭方法拓展
	 *   mark 为当前参数
	 *   default_value 为默认参数
	 */
	function easyCloseHandle(mark,default_value){
		var me = this;
		if(typeof(mark) == 'boolean' ? mark : default_value){
			utils.addClass(me.dom,'UI_easyClose');
			setTimeout(function(){
				private_active.push(me);
			});
		}
	}
	
	
	/**
	 * 模糊效果
	 */
	function addRootElements(callback){
		var doms = private_body.childNodes;
		utils.each(doms,function(i,dom){
			if(dom != private_allCnt && dom.nodeType ==1 && dom.tagName != 'SCRIPT' && dom.tagName != 'LINK' && dom.tagName != 'STYLE'){
				callback(dom);
			}
		});
	}
	var blur = removeBlur = null;
	if(utils.supports('-webkit-filter')){
		blur = function (){
			addRootElements(function(dom){
				utils.addClass(dom,'UI-blur');
			});
		};
		removeBlur = function (){
			addRootElements(function(dom){
				utils.removeClass(dom,'UI-blur');
			});
		};
	}
	
	//存储蒙层信息
	var maskObjs = [];
	//获取最后一个蒙层信息
	function maskObjsLast(){
		var len = maskObjs.length;
		return len ? maskObjs[len-1] : null;
	}
	
	/**
	 * 显示蒙层 
	 */
	function showMask(callback){
		var lastMask = maskObjsLast();
		zIndex = lastMask ? lastMask[1] + 2 : 2;
		setCSS(this.dom,{
			'zIndex': zIndex
		});
		if(!this._mask){
			callback && callback();
			return;
		}
		setCSS(private_maskDom,{
			'zIndex': zIndex - 1
		});
		
		if(lastMask){
			//尚有需要蒙层的元素
			callback && callback();
		}else{
			//没有需要蒙层的元素，关闭蒙层
			if(!isIE678){
				utils.fadeIn(private_maskDom,500,function(){
					callback && callback();
				});
				blur && blur();
			}else{
				setCSS(private_maskDom,{
					'display':'block'
				});
				callback && callback();
			}
		}
		maskObjs.push([this,zIndex]);
	}
	//在指定DOM后插入新DOM
	function insertAfter(newElement, targetElement){
		var parent = targetElement.parentNode;
		if (parent.lastChild == targetElement) {
			// 如果最后的节点是目标元素，则直接追加
			parent.appendChild(newElement);
		} else {
			//插入到目标元素的下一个兄弟节点之前
			parent.insertBefore(newElement, targetElement.nextSibling);
		}
	}
	
	/**
	 * 计算动画所需的方向及目标值
	 *   @returns[0] 所需修改的方向
	 *   @returns[1] 当前方向的值
	 *   @returns[2] 计算后的值
	 */
	function countAnimation(DOM,direction,range){
		var prop,
			start,
			result;
		
		if(direction == 'left' || direction == 'right'){
			//判断dom水平定位依据
			var left = getCSS(DOM,'left');
			if(left != 'auto'){
				prop = 'left';
				start = left;
			}else{
				prop = 'right';
				start = getCSS(DOM,'right');
			}
		}else{
			//判断dom垂直定位依据
			var top = getCSS(DOM,'top');
			if(top != 'auto'){
				prop = 'top';
				start = top;
			}else{
				prop = 'bottom';
				start= getCSS(DOM,'bottom');
			}
		}
		result = (prop == direction) ? start + range : start - range;
		return [prop,start,result];
	}
	/**
	 * 开场动画
	 *   创建一个dom用来完成动画
	 *   动画结束，设置dom为结束样式
	 **/
	var openAnimation = isIE678 ? function (a,b,c,d,fn){
		fn && fn();
	} : function (DOM,from,time,animation_range,fn){
		if(!from || from == 'none' || !animation_range){
			fn && fn();
			//不需要动画
			return
		}
		var offset = utils.offset(DOM);
		
		//动画第一帧css
		var cssStart = {},
			//动画需要改变的css
			cssAnim = {};
		
		//参数是dom对象
		if(from.tagName && from.parentNode){
			time = 200;
			var offset_from = utils.offset(from);
			cssStart = {
				'top' : offset_from.top,
				'left' : offset_from.left,
				'width' : outerWidth(from),
				'height' : outerHeight(from),
				'overflow' : 'hidden'
			};
			cssAnim = {
				'width' : getCSS(DOM,'width'),
				'height' : getCSS(DOM,'height'),
				'top' : getCSS(DOM,'top'),
				'left' : getCSS(DOM,'left')
			};
		//参数是字符串
		}else if(typeof(from) == 'string'){
			var countResult = countAnimation(DOM,from,-animation_range);
			cssStart[countResult[0]] = countResult[2];
			cssAnim[countResult[0]] = countResult[1];
		}
		//拷贝dom用来完成动画
		var html = DOM.outerHTML;
		//FIXME 过滤iframe正则随便写的
		html = html.replace(/<iframe.+>\s*<\/iframe>/ig,'');
		var animDom = utils.createDom(html)[0];
		//为了效果跟流畅，隐藏内容部分
		var cntDom = findByClassName(animDom,'UI_cnt')[0];
		insertAfter(animDom,DOM);
		if(cntDom){
			setCSS(animDom,{
				'height' : outerHeight(DOM)
			});
			cntDom.innerHTML = '';
		}
		
		
		//隐藏真实dom
		setCSS(DOM,{
			'display' : 'none'
		});
		
		//放置于初始位置
		cssStart.opacity = 0;
		setCSS(animDom,cssStart);
		//动画开始
		cssAnim.opacity = 1;
		animation(animDom,cssAnim,time,'SineEaseIn',function(){
			//删除动画dom
			utils.removeNode(animDom);
			//显示真实dom
			setCSS(DOM,{
				'display' : 'block'
			});
			fn && fn();
		});
	};
	/**
	 * 处理对象关闭及结束动画
	 */
	function closeAnimation(time_define,animation_range,fn){
		return function(time){
			var me = this;
			
			//检测、记录自己是否“活着”
			if(me.dead){
				return;
			}
			me.dead = true;
			
			//处理关闭回调、蒙层检测
			var DOM = me.dom;
			fn && fn.call(me);
			function endFn(){
				utils.removeNode(DOM);
				me.closeFn && me.closeFn();
				/**
				 * 关闭蒙层
				 */
				if(me._mask){
					utils.each(maskObjs,function(index,item){
						if(item[0] == me){
							maskObjs.splice(index,1);
							return false;
						}
					});
					var lastMask = maskObjsLast();
					setCSS(private_maskDom,{
						'zIndex' : (lastMask ? lastMask[1]-1 : 1)
					});
					
					if(!lastMask){
						removeBlur && removeBlur();
						if(!isIE678){
							utils.fadeOut(private_maskDom,400);
						}else{
							setCSS(private_maskDom,{'display':'none'});
						}
					}
				}
			}
			
			if(isIE678){
				endFn();
				return
			}
			
			var time = isNum(time) ? time : parseInt(time_define) || 80;
			var from = me._from;
			
			var range = animation_range || 80;
			
			var cssEnd = {
				'opacity' : 0
			};
			if(from && from.tagName && from.parentNode){
				utils.zoomOut(DOM,time,function(){
					endFn();
				});
			}else if(typeof(from) == 'string'){
				
				var countResult = countAnimation(DOM,from,-range);
				cssEnd[countResult[0]] = countResult[2];
				
				//动画开始
				animation(DOM,cssEnd,time,'SineEaseIn',function(){
					endFn();
				});
			}else{
				endFn();
			}
		}
	}
	
	/**
	 * 弹框
	 * pop 
	 */
	function POP(param){
		var param = param || {};
		var me = this;
		
		me.dom = utils.createDom(pop_tpl)[0];
		me.cntDom = findByClassName(me.dom,'UI_cnt')[0];
		me.closeFn = param.closeFn || null;
		me._mask = param.mask || false;
		me._from = param.from || 'top';
		

		//当有确认参数时
		if(param.confirm){
			add_confirm(me.dom,param.confirm,function(){
				me.close();
			});
		}
		//处理title参数
		var caption_dom = findByClassName(me.dom,'UI_pop_cpt')[0];
		if(!param.title){
			utils.removeNode(caption_dom);
		}else{
			var title = param.title || 'need title in parameter!';
			
			caption_dom.innerHTML = title;
			//can drag is pop
			utils.drag(caption_dom,me.dom,{
				'move' : function(mx,my,l_start,t_start,w_start,h_start){
					var left = mx + l_start;
					var top = my + t_start;
					
					var newSize = fix_position(top,left,w_start,h_start);
					setCSS(me.dom,{
						'left' : newSize.left,
						'top' : newSize.top
					});
				}
			});
		}
		
		bindEvent(me.dom,'click','.UI_pop_close',function(){
			me.close();
		});
	
		//插入内容
		me.cntDom.innerHTML = param.html || '';
		
		showMask.call(me,function(){
			var this_width = Math.min(param.width || 600,private_docW-20);
			
			//设置宽度，为计算位置尺寸做准备
			setCSS(me.dom,{
				'width' : this_width
			});
			private_allCnt.appendChild(me.dom);
			
			//校正位置
			adaption(me.dom,param);
			
			//开场动画
			openAnimation(me.dom,me._from,200,80,function(){
				//处理是否易于关闭
				easyCloseHandle.call(me,param.easyClose,true);
			});
		});
	}
	//使用close方法
	POP.prototype.close = closeAnimation(500);
	POP.prototype.adapt = function(){
		adaption(this.dom,null,100);
	};

	/**
	 * CONFIRM 
	 */
	function CONFIRM(param){
		var param = param || {};
		var me = this;
		
		var this_html = utils.render(confirm_tpl,{
			'text' : param.text || 'need text in parameter!'
		});
		me.dom = utils.createDom(this_html)[0];
		me.closeFn = param.closeFn || null;
		me._mask = typeof(param.mask) == 'boolean' ? param.mask : true;
		me._from = param.from || 'top';
		
		add_confirm(me.dom,param,function(){
			me.close();
		});
		//显示蒙层
		showMask.call(me,function(){
			private_allCnt.appendChild(me.dom);
			
			adaption(me.dom);
			
			openAnimation(me.dom,me._from,100,80,function(){
				//处理是否易于关闭
				easyCloseHandle.call(me,param.easyClose,true);
			});
		});
	}
	CONFIRM.prototype.close = closeAnimation(200);


	/**
	 * ASK 
	 */
	function ASK(text,callback,param){
		var me = this;
		var param = param || {};
		
		var this_html = utils.render(ask_tpl,{
			'text' : text || 'need text in parameter!'
		});

		me.dom = utils.createDom(this_html)[0];
		me._mask = typeof(param.mask) == 'boolean' ? param.mask : true;
		me._from = param.from || 'top';
		me.inputDom = findByClassName(me.dom,'UI_ask_key')[0];
		me.closeFn =  null;
		
		var confirm_html = utils.render(confirmBar_tpl,{
			'confirm' : '确定',
			'cancel' : '取消'
		});
		
		me.dom.appendChild(utils.createDom(confirm_html)[0]);
		
		//确定
		bindEvent(me.dom,'click','.UI_pop_confirm_ok',function(){
			//根据执行结果判断是否要关闭弹框
			callback ? ((callback(me.inputDom.value) != false) && me.close()) : me.close();
		});
		//取消
		bindEvent(me.dom,'click','.UI_pop_confirm_cancel',function(){
			me.close();
		});

		//显示蒙层
		showMask.call(me,function(){
			private_allCnt.appendChild(me.dom);
			
			adaption(me.dom);
			
			openAnimation(me.dom,me._from,100,80,function(){
				me.inputDom.focus();
				//处理是否易于关闭
				easyCloseHandle.call(me,param.easyClose,true);
			});
		});
		
	}
	ASK.prototype.close = closeAnimation(200);
	ASK.prototype.setValue = function(text){
		this.inputDom.value = text.toString();
	};


	/**
	 * prompt
	 * 
	 **/
	function PROMPT(text,time,param){
		var param = param || {};
		var me = this;
		me.dom = utils.createDom(prompt_tpl)[0];
		me._from = param.from || 'bottom';
		me._mask = param.mask ? true : false;
		me.tips(text,time);
		
		// create pop
		showMask.call(me,function(){
			private_allCnt.appendChild(me.dom);
			adaption(me.dom);
			
			openAnimation(me.dom,me._from,100,30);
		});
	}
	PROMPT.prototype.close = closeAnimation(80);
	PROMPT.prototype.tips = function(txt,time){
		var me = this;
		if(txt){
			findByClassName(this.dom,'UI_cnt')[0].innerHTML = txt;
		}
		if(time != 0){
			setTimeout(function(){
				me.close();
			},(time || 1500));
		}
	};

	/**
	 *	PLANE 
	 */
	function PLANE(param){
		var me = this;
		var param = param || {};
		
		me.closeFn = param.closeFn || null;
		me.dom = utils.createDom(plane_tpl)[0];
		me._from = param.from || null;
		
		//insert html
		me.dom.innerHTML = param.html || '';
		
		setCSS(me.dom,{
			'width' : param.width || 240,
			'height' : param.height || null,
			'top' : isNum(param.top) ? param.top : 300,
			'left' : isNum(param.left) ? param.left : 800
		});
		showMask.call(me,function(){
			private_allCnt.appendChild(me.dom);
			openAnimation(me.dom,me._from,100,80,function(){
				//处理是否易于关闭
				easyCloseHandle.call(me,true);
			});
		});
	}
	PLANE.prototype.close = closeAnimation(200);


	/***
	 * 全屏弹框
	 * COVER 
	 */
	function COVER(param){
		var param = param || {};
		var me = this;
		me.dom = utils.createDom(cover_tpl)[0];
		me._mask = typeof(param.mask) == 'boolean' ? param.mask : false;
		me._from = param.from || 'top';
		
		me.cntDom = findByClassName(me.dom,'UI_cnt')[0];
		me.closeFn = param.closeFn || null;
		
		
		//关闭事件
		bindEvent(me.dom,'click','.UI_close',function(){
			me.close();
		});

		
		//记录body的scrollY设置
		me._bodyOverflowY = getCSS(private_body,'overflowY');
		var cssObj = {
			'width' : isNum(param.width) ? Math.min(private_docW,param.width) : null,
			'height' : isNum(param.height) ? Math.min(private_winH,param.height) : private_winH
		};
		//水平定位
		if(isNum(param.right)){
			cssObj.right = param.right;
		}else if(isNum(param.left)){
			cssObj.left = param.left;
		}else{
			cssObj.position = 'relative';
			cssObj.margin = 'auto';
		}
		//垂直定位
		if(isNum(param.bottom)){
			cssObj.top = private_winH - cssObj.height - param.bottom + private_scrollTop;
		}else if(isNum(param.top)){
			cssObj.top = private_scrollTop + param.top;
		}else{
			cssObj.top = private_scrollTop + (private_winH - cssObj.height)/2
		}
		//打开蒙层
		showMask.call(me,function(){
			setCSS(me.dom,cssObj);
			private_allCnt.appendChild(me.dom);
			
			openAnimation(me.dom,me._from,200,400,function(){
				setCSS(private_body,{
					'overflowY' : 'hidden'
				});
				//处理是否易于关闭
				easyCloseHandle.call(me,true);
			});
		});
		//insert html
		me.cntDom.innerHTML = param.html || '';
	}
	//使用close方法
	COVER.prototype.close = closeAnimation(400,500,function(){
		setCSS(this.cntDom,{
			'overflowY' : 'hidden'
		});
		setCSS(private_body,{
			'overflowY' : this._bodyOverflowY
		});
	});

	/**
	 * 选择功能
	 */
	function SELECT(list,param){
		var me = this,
			param = param || {},
			list = list || [],
			fns = [],
			nameList = [];
		
		utils.each(list,function(i,item){
			nameList.push(item[0]);
			fns.push(item[1]);
		});
		var this_html = utils.render(select_tpl,{
			'list' : nameList,
			'title' : param.title || null,
			'intro' : param.intro || null
		});
		
		me.dom = utils.createDom(this_html)[0];
		me.closeFn = param.closeFn || null;
		me._from = param.from || 'bottom';
		me._mask = private_docW > 640 ? param.mask : true;
		
		//绑定事件
		var btns = findByClassName(me.dom,'UI_select_btn');
		utils.each(btns,function(index,btn){
			bindEvent(btn,'click',function(){
				fns[index] && fns[index]();
				me.close();
			});
		});
		
		//显示蒙层
		showMask.call(me,function(){
			if(private_docW < 640 && !isIE678){
				//手机版
				me._from = 'bottom';
				private_allCnt.appendChild(me.dom);
			}else{
				var cssObj = {
					'top' : param.top || 100,
					'left' : param.left || 100,
					'width' : param.width || 200
				};
				private_allCnt.appendChild(me.dom);
				
				setCSS(me.dom,cssObj);
				var newSize = fix_position(cssObj.top,cssObj.left,cssObj.width,outerHeight(me.dom));
				setCSS(me.dom,{
					'left' : newSize.left,
					'top' : newSize.top
				});
			}
			openAnimation(me.dom,me._from,200,400,function(){
				easyCloseHandle.call(me,param.easyClose,true);
			});
		});
		
	}
	SELECT.prototype.close = closeAnimation(200);
	/**
	 *  抛出对外接口
	 */
	return {
		'pop' : function(){
			return new POP(arguments[0]);
		},
		'config' : {
			'gap' : function(name,value){
				//name符合top/right/bottom/left,且value值为数字类型（兼容字符类型）
				if(name && typeof(private_CONFIG.gap[name]) == 'number' && isNum(value)){
					private_CONFIG.gap[name] = parseInt(value);
				}
			},
			'zIndex' : function(num){
				var num = parseInt(num);
				if(num > 0){
					private_CONFIG.zIndex = num;
					setCSS(private_allCnt,{
						zIndex : num
					});
				}
			}
		},
		'confirm' : function(){
			return new CONFIRM(arguments[0]);
		},
		'ask' : function(text,callback,param){
			return new ASK(text,callback,param);
		},
		'prompt' : function(txt,time,param){
			return new PROMPT(txt,time,param);
		},
		'plane' : function(){
			return new PLANE(arguments[0]);
		},
		'cover' : function(){
			return new COVER(arguments[0]);
		},
		'select' : function(){
			return new SELECT(arguments[0],arguments[1]);
		}
	};
},function (window,document) {
	/**
	 * 判断对象类型
	 * String Number Array
	 * Object Function 
	 * HTMLDocument
	 * Undefined Null
	 */
	function TypeOf(obj) {
		return Object.prototype.toString.call(obj).match(/\s(\w+)/)[1];
	}
	
	/**
	 * 检测是否为数字
	 * 兼容字符类数字 '23'
	 */
	function isNum(ipt){
		return (ipt !== '') && (ipt == +ipt) ? true : false;
	}
	
	/**
 	 * 遍历数组或对象
	 * 
	 */
	function each(arr,fn){
		//检测输入的值
		if(typeof(arr) != 'object' || typeof(fn) != 'function'){
			return;
		}
		var Length = arr.length;
		if( isNum(Length) ){
			for(var i=0;i<Length;i++){
				if(fn.call(this,i,arr[i]) === false){
					break
				}
			}
		}else{
			for(var i in arr){
				if (!arr.hasOwnProperty(i)){
					continue;
				}
				if(fn.call(this,i,arr[i]) === false){
					break
				}
			}
		}
	}
	
	/**
	 * 对象拷贝
	 *
	 */
	function clone(fromObj,toObj){
		each(fromObj,function(i,item){
			if(typeof item == "object"){   
				toObj[i] = item.constructor==Array ? [] : {};
				
				clone(item,toObj[i]);
			}else{
				toObj[i] = item;
			}
		});
		
		return toObj;
	}	
	/**
	 * 判断是否支持css属性
	 * 兼容css3
	 */
	var supports = (function() {
		var styles = document.createElement('div').style,
			vendors = 'Webkit Khtml Ms O Moz'.split(/\s/);
		
		return function(prop) {
			var returns = false;
			if ( prop in styles ){
				returns = prop;
			}else{
				prop = prop.replace(/^[a-z]/, function(val) {
					return val.toUpperCase();
				});
				each(vendors,function(i,value){
					if ( value + prop in styles ) {
						returns = ('-' + value + '-' + prop).toLowerCase();
						return false;
					}
				});
			}
			return returns;
		};
	})();
	
	
	var private_css3 = (supports('-webkit-transition') && supports('-webkit-transform')) ? true : false;
	
    var Tween = {
		Linear: function (t, b, c, d) { return c * t / d + b; },
		SineEaseIn: function (t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
		}
    }
	

	/**
	 * 判断dom是否拥有某个class
	 */
	function hasClass(dom,classSingle){
		return dom.className && dom.className.match(new RegExp('(\\s|^)' + classSingle + '(\\s|$)')) || false;
	}
	
	//获取样式
	function getStyle(elem, prop) {
		var value;
		prop == "borderWidth" ? prop = "borderLeftWidth" : prop;
		if (elem.style[prop]){
			value = elem.style[prop];
		} else if(document.defaultView) {
			var style = document.defaultView.getComputedStyle(elem, null);
			value = prop in style ? style[prop] : style.getPropertyValue(prop);
		} else if (elem.currentStyle) {
			value = elem.currentStyle[prop];
		}
		
		
		if (/\px$/.test(value)){
			value = parseInt(value);
		}else if (isNum(value) ){
			value = Number(value);
		} else if(value == '' || value == 'medium'){
			value = 0;
		} else if (value == 'auto'){
			if(prop == 'height'){
				value = elem.clientHeight;
			}else if(prop == 'width'){
				value = elem.clientWidth;
			}
		}
		
		return value;
	}
	

	/**
	 * dom设置样式
	 */
	function setStyle(elem,prop,value){
		prop = prop.toString();
		if (prop == "opacity") {
			elem.style.filter = 'alpha(opacity=' + (value * 100)+ ')';
			value = value;
		} else if ( isNum(value) && prop != 'zIndex'){
			value = value + "px";
		}
		elem.style[prop] = value;
	}
	//设置css
	function setCss(doms,cssObj){
		doms = [].concat(doms);
		each(doms,function(i,dom){
			each(cssObj,function(key,value){
				setStyle(dom,key,value);
			});
		});
	}
	
	/**
	 * 获取动画所需的参数，只获取为数字的参数
	 *
	 * 属性名
	 * 初始值
	 * 目标值
	 */
	function parseCSS_forAnim (elem, cssObj) {
		var props = [];
		var cssOri = [];
		var cssEnd = [];
		each(cssObj,function(key,end_value){
			var value = getStyle(elem, key);
			//格式化css属性值
			if (/\px$/.test(value)){
				value = parseInt(value);
			}
			
			if( isNum(value) ){
				value = Number(value);
				props.push(key);
				cssOri.push(value);
				cssEnd.push(end_value);
			}
		});
		return [props,cssOri,cssEnd];
	}
	
	var requestAnimationFrame = (function () {
        return  window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				function (callback) {
					return window.setTimeout(callback, 10);
				};
    })();
	
	/**
	 * JS动画类
	 * 内部类，不检测参数
	 */
    function JS_anim(elem,cssObj,durtime,animType,onEnd) {
        this.elem = elem;
		
		var cssParse = parseCSS_forAnim(this.elem, cssObj);
		
		//需要修改的属性Array
		this.props = cssParse[0];
		//属性初始值Array
		this.cssOri = cssParse[1];
		//属性目标值Array
		this.cssEnd = cssParse[2];
		this.durtime = durtime;
		this.animType = animType || "Linear";
		this.onEnd = onEnd;
		
		this.startAnim();
    }
    JS_anim.prototype.startAnim = function () {
		var me = this;
		//全部时间 | 开始时间
		var time_all = this.durtime;
		var time_start = new Date();
		
		//运动曲线方程
		var aniFunction = Tween[me.animType];
		
		//是否已结束动画
		var is_end = false;
		
		//需要修改的css条数
		var css_length = this.props.length;
		
		//显示当前帧（递归）
		function showFrame(){
			var time_use = new Date() - time_start;
			
			if (time_use < time_all) {
				requestAnimationFrame(showFrame);
			}else{
				time_use = time_all;
				is_end = true;
			}
			var start,end,value;
			for (var i = 0; i < css_length; i++) {
				//计算当前帧需要的属性值
				start = me.cssOri[i];
				end = me.cssEnd[i];
				value = aniFunction(time_use, start, (end-start), time_all);
				setStyle(me.elem,me.props[i],value);
			}
			
			
			if(is_end){
				me.onEnd && me.onEnd.call(me, me.elem);
			}
		}
		//开始动画
		requestAnimationFrame(showFrame);
	};
	
	/**
	 * css3动画
	 * 内部类，不检测参数
	 */
	function css_anim(elem,cssObj,durtime,animType,onEnd){
		
		//记录初始transition值
		var transition_start = getStyle(elem,'-webkit-transition');
		var cssSet = clone(cssObj,{
			'-webkit-transform' : 'translate3d(0, 0, 0)',
			'-webkit-transition' : durtime + 'ms'
		});
		/**
		 * 动画结束回调
		 */
		var isEnd = false;
		function endFn(){
			isEnd = true;
			elem.removeEventListener("webkitTransitionEnd",transitionFn, true);
			//还原transition值
			setCss(elem,{
				'-webkit-transition' : transition_start
			});
			onEnd && onEnd.call(elem);
			onEnd = null;
		}
		
		/**
		 * 高大上的webkitTransitionEnd
		 *   动画过程中，在每一帧持续触发
		 */
		var delay;
		function transitionFn(){
			clearTimeout(delay);
			delay = setTimeout(function(){
				!isEnd && endFn();
			},40);
		}
		elem.addEventListener("webkitTransitionEnd",transitionFn, true);
		
		/**
		 * 加一份保险
		 *   解决 css无变化时webkitTransitionEnd事件不会被触发的问题
		 */
		setTimeout(function(){
			!isEnd && endFn();
		},durtime + 80);
		
		//设置样式开始
		setCss(elem,cssSet);
	}
	/**
	 * 兼容css3、js动画
	 */
	function animation(elem,cssObj,durtime,a,b) {
        var animType = "Linear",
			onEnd = null;
		
		if (arguments.length < 3) {
			throw new Error("missing arguments [dom,cssObj,durtime]");
		} else {
			if (TypeOf(a) == "Function") {
				onEnd = a;
			}else if (typeof (a) == "string") {
				animType = a;
			}
			
			if (TypeOf(b) == "Function") {
				onEnd = b;
			}
		}
		if(private_css3){
			return css_anim(elem,cssObj,durtime,animType,onEnd);
		}else{
			return new JS_anim(elem,cssObj,durtime,animType,onEnd);
		}
	}
	var outerWidth,
		outerHeight;
	var testDom = document.createElement('div');
	//用生命在计算宽度
	function count_outerWidth (elem){
		return (getStyle(elem,'borderLeftWidth') + getStyle(elem,'paddingLeft') + getStyle(elem,'width') + getStyle(elem,'paddingRight') + getStyle(elem,'borderRightWidth'));
	}
	//用生命在计算高度
	function count_outerHeight (elem){
		return (getStyle(elem,'borderTopWidth') + getStyle(elem,'paddingTop') + getStyle(elem,'height') + getStyle(elem,'paddingBottom') + getStyle(elem,'borderBottomWidth'));
	}
	if(testDom.getBoundingClientRect !== 'undefined'){
		outerWidth = function(elem){
			var output = elem.getBoundingClientRect().width;
			
			return typeof(output) == 'number' ? output : count_outerWidth(elem);
		};
		outerHeight = function(elem){
			var output = elem.getBoundingClientRect().height;
			
			return typeof(output) == 'number' ? output : count_outerHeight(elem);
		};
	}else{
		outerWidth = count_outerWidth;
		outerHeight = count_outerHeight;
	}
	
	/**
	 * 事件绑定
	 * elem:节点
	 * type:事件类型
	 * handler:回调
	 */
    var bindHandler = (function() {
		// 标准浏览器
		if (window.addEventListener) {
			return function(elem, type, handler) {
				// 最后一个参数为true:在捕获阶段调用事件处理程序
				//为false:在冒泡阶段调用事件处理程序
				elem.addEventListener(type, handler, false);
			}
		} else if (window.attachEvent) {
			// IE浏览器
			return function(elem, type, handler) {
				elem.attachEvent("on" + type, handler);
			}
		}
	})();

	/**
	 * 事件解除
	 * elem:节点
	 * type:事件类型
	 * handler:回调
	 */
	var removeHandler = (function() {
		// 标准浏览器
		if (window.removeEventListener) {
			return function(elem, type, handler) {
				elem.removeEventListener(type, handler, false);
			}
		} else if (window.detachEvent) {
			// IE浏览器
			return function(elem, type, handler) {
				elem.detachEvent("on" + type, handler);
			}
		}
	})();
	
	function checkEventForClass(event,classStr,dom){
		var target = event.srcElement || event.target;
		while (1) {
			if(target == dom || !target){
				return false;
			}
			if(hasClass(target,classStr)){
				return target;
			}
			
			target = target.parentNode;
		}
	}
	function bind(elem, type,a,b){
		var className,fn;
		if(typeof(a) == 'string'){
			className = a.replace(/^\./,'');
			fn = b;
			callback = function(e){
				var bingoDom = checkEventForClass(e,className,elem);
				if(bingoDom){
					fn && fn.call(bingoDom);
				}
			};
		}else{
			callback = a;
		}
		bindHandler(elem,type,callback);
	}
	
	
    return {
		TypeOf : TypeOf,
		isNum : isNum,
		each : each,
		getStyle : getStyle,
		css : setCss,
		animation : animation,
		supports : supports,
		outerWidth : outerWidth,
		outerHeight : outerHeight,
		bind : bind,
		clone : clone,
		unbind : removeHandler,
		hasClass : hasClass,
		'addClass' : function (dom, cls) {
			if (!this.hasClass(dom, cls)) dom.className += " " + cls;
		},
		'removeClass' : function (dom, cls) {
			if (hasClass(dom, cls)) {
				var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
				dom.className = dom.className.replace(reg, ' ');
			}
		},
		/**
		 * 页面加载
		 */
		ready : (function(){
			var readyFns = [];
			function completed() {
				removeHandler(document,"DOMContentLoaded", completed);
				removeHandler(window,"load", completed);
				each(readyFns,function(i,fn){
					fn();
				});
				readyFns = null;
			}
			return function (callback){
				if ( document.readyState === "complete" ) {
					callback && callback();
				} else {
					callback && readyFns.push(callback);
					
					bindHandler(document,'DOMContentLoaded',completed);
					bindHandler(window,'load',completed);
				}
			}
		})(),
		//缩小，淡出
		zoomOut :  private_css3 ? function(DOM,time,fn){
			var op = getStyle(DOM,'opacity');
			
			css_anim(DOM,{
				'-webkit-transform' : 'scale(0.5)',
				opacity : 0
			},time,null,function(){
				setCss(DOM,{
					'-webkit-transform' : 'scale(1)',
					opacity : op
				});
				fn && fn.call(DOM);
			});

		} : function (DOM,time,fn){
			var op = getStyle(DOM,'opacity');
			DOM.style.overflow = 'hidden';
			var width = getStyle(DOM,'width');
			var height = outerHeight(DOM);
			var left = getStyle(DOM,'left') || 0;
			var top = getStyle(DOM,'top') || 0;
			
			animation(DOM,{
				width : width/2,
				height : height/2,
				left : (left + width/4),
				top : (top + height/4),
				opacity : 0
			},time,function(){
				DOM.style.opacity = op;
				DOM.style.display = 'none';
				fn && fn.call(DOM);
			});
		},
		//通用拖动方法
		drag : function drag(handle_dom,dom,param){
			var param = param || {};
			var onStart = param.start || null;
			var onMove = param.move || null;
			var onEnd = param.end || null;
			
			var X, Y,L,T,W,H;
			bindHandler(handle_dom,'mousedown',function (e){
				e.preventDefault && e.preventDefault();
				e.stopPropagation && e.stopPropagation();
				X = e.clientX;
				Y = e.clientY;
				L = getStyle(dom,'left');
				T = getStyle(dom,'top');
				W = outerWidth(dom);
				H = outerHeight(dom);
				onStart && onStart.call(dom,X,Y);
				bindHandler(document,'mousemove',move);
				bindHandler(document,'mouseup',up);
			});
			
			function move(e){
				onMove && onMove.call(dom,(e.clientX - X),(e.clientY - Y),L,T,W,H);
				//做了点儿猥琐的事情，你懂得
				e.preventDefault && e.preventDefault();
				e.stopPropagation && e.stopPropagation();
				window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();
			}
			function up(e) {
				removeHandler(document,'mousemove',move);
				removeHandler(document,'mouseup',up);
				onEnd && onEnd.call(dom);
			}
		},
		//创建dom
		createDom : function (html){
			var a = document.createElement('div');
			a.innerHTML = html;
			return a.childNodes;
		},
		//移除dom节点
		removeNode : function (elem){  
			if(elem && elem.parentNode && elem.tagName != 'BODY'){  
				elem.parentNode.removeChild(elem);  
			}  
		},
		//创建style标签
		createStyleSheet : function (cssStr,attr){
			var styleTag = document.createElement('style');
			
			attr = attr || {};
			attr.type = "text/css";
			//设置标签属性
			each(attr,function(i,value){
				styleTag.setAttribute(i, value);
			});
			
			// IE
			if (styleTag.styleSheet) {
				styleTag.styleSheet.cssText = cssStr;
			} else {
				var tt1 = document.createTextNode(cssStr);
				styleTag.appendChild(tt1);
			}
			//插入页面中
			(document.head || document.getElementsByTagName('head')[0]).appendChild(styleTag);
			return styleTag;
		},
		//根据class查找元素
		findByClassName : (function(){
			if(typeof(document.getElementsByClassName) !== 'undefined'){
				//支持gEbCN
				return function (dom,classStr){
					return dom.getElementsByClassName(classStr);
				};
			}else{
				//无奈采用遍历法
				return function (dom,classStr){
					var returns = [];
					//尝试获取所有元素
					var caches = dom.getElementsByTagName("*");
					//遍历结果
					each(caches,function(i,thisDom){
						//检查class是否合法
						if(hasClass(thisDom,classStr)){
							returns.push(thisDom);
						}
					});
					return returns;
				};
			}
		})(),
		 //读取dom在页面中的位置
		offset : function (elem){
			var box = {
				top : 0,
				left : 0,
				screen_top : 0,
				screen_left : 0
			},
			size;
			
			if (typeof(elem.getBoundingClientRect) !== 'undefined' ) {
				size = elem.getBoundingClientRect();
			}
			box.screen_top = size.top;
			box.screen_left = size.left;
			
			box.top = size.top + (document.documentElement.scrollTop == 0 ? document.body.scrollTop : document.documentElement.scrollTop);
			box.left = size.left + document.body.scrollLeft;
			
			return box;
		},
		//淡入
		fadeIn : function (DOM,time,fn){
			var op = getStyle(DOM,'opacity');
			setCss(DOM,{
				'opacity' : 0,
				'display' : 'block'
			});
			/**
			 * 不知道为啥，设置完css直接执行动画，没效果
			 *   可能是浏览器优化js逻辑
			 */
			setTimeout(function(){
				animation(DOM,{
					'opacity' : op
				}, time, function(){
					fn && fn.call(DOM);
				});
			},10);
		},
		//淡出
		fadeOut : function (DOM,time,fn){
			var op = getStyle(DOM,'opacity');
			animation(DOM,{
				'opacity' : 0
			}, time,function(){
				DOM.style.opacity = op;
				DOM.style.display = 'none';
				fn && fn.call(DOM);
			});
		},
		render : function (str, data){
			if(!str || !data){
				return '';
			}
			return (new Function("obj",
				"var p=[];" +
				"with(obj){p.push('" +
				str
				.replace(/[\r\t\n]/g, " ")
				.split("<%").join("\t")
				.replace(/((^|%>)[^\t]*)'/g, "$1\r")
				.replace(/\t=(.*?)%>/g, "',$1,'")
				.split("\t").join("');")
				.split("%>").join("p.push('")
				.split("\r").join("\\'")
			+ "');}return p.join('');"))(data);
		}
    }
});