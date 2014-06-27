/**
 * @author bh-lay
 * 
 * @github https://github.com/bh-lay/UI
 * @modified 2014-6-27 21:36
 * 
 **/

(function(global,doc,UI_factory,utils_factory){
	
	//初始化工具类
	var utils = utils_factory();
	
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
	 * base template
	 */
	var allCnt_tpl = '<div class="UI_lawyer"><div class="UI_mask"></div><div class="UI_main_cnt"></div><div class="UI_fixedScreenTop_cnt"></div><div class="UI_fixedScreenBottom_cnt"></div></div>';
	var dragMask_tpl = '<div style="position:absolute;top:0px;left:0px;z-index:100000;cursor:default;"></div>';
	var pop_tpl = '<div class="UI_pop"><div class="UI_pop_cpt"></div><div class="UI_pop_cnt"></div><a href="javascript:void(0)" class="UI_pop_close" title="\u5173\u95ED">×</a></div>';
	var miniChat_tpl = '<div class="UI_miniChatSlideCnt"><div class="UI_miniChat"><div class="UI_miniChat_text">{text}</div></div></div>';
	var confirm_tpl = '<div class="UI_confirm"><div class="UI_confirm_text">{text}</div></div>';
	var ask_tpl = '<div class="UI_ask"><div class="UI_ask_text">{text}</div><input class="UI_ask_key" type="text" name="UI_ask_key"/></div>';
	var confirmBar_tpl = '<div class="UI_pop_confirm"><a href="javascript:void(0)" class="UI_pop_confirm_ok">{confirm}</a><a href="javascript:void(0)" class="UI_pop_confirm_cancel">{cancel}</a></div>';
	var plane_tpl = '<div class="UI_plane"></div>';
	var prompt_tpl = '<div class="UI_prompt"><div class="UI_cnt"></div></div>';
	var cover_tpl = '<div class="UI_cover"><div class="UI_coverCnt"></div><a href="javascript:void(0)" class="UI_coverClose">〉</a></div>';
	var select_tpl = '<div class="UI_select"><div class="UI_select_body"> {caption} <div class="UI_selectCnt">{list}</div></div><div class="UI_selectCancel"><a class="UI_select_btn" href="javascript:void(0)" data-index="-1">取消</a></div></div>';
	
	var popCSS = '<style type="text/css" data-module="UI">.UI_lawyer{position:absolute;top:0px;left:0px;z-index:4999;width:100%;height:0px;overflow:visible;font-family:"Microsoft Yahei"}.UI_lawyer a,.UI_lawyer a:hover{text-decoration:none;-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-tap-highlight-color:transparent;}.UI_mask{position:absolute;top:0px;left:0px;width:100%;background-color:#000;display:none;opacity:0.2}.UI_main_cnt{width:0px;height:0px;overflow:visible;}.UI_fixedScreenTop_cnt{position:absolute;z-index:4999;top:0px;left:0px;width:100%;height:0px;overflow:visible;}.UI_fixedScreenBottom_cnt{position:absolute;z-index:4999;left:0px;width:100%;height:0px;overflow:visible;}.UI_pop{width:200px;_border:1px solid #eee;position:absolute;top:400px;left:300px;background:#fff;border-radius:4px;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}.UI_pop_cpt{position:relative;height:36px;line-height:36px;overflow:hidden;border-bottom:1px solid #ebebeb;color:#333;font-size:16px;text-indent:15px;cursor:default;}.UI_pop_cnt{position:relative;min-height:100px;overflow:auto;width:100%;}.UI_pop_close{display:block;position:absolute;top:0px;right:0px;width:40px;height:36px;text-align:center;line-height:36px;color:#ddd;font-family:"Simsun";font-size:24px;font-weight:bold;text-decoration:none;transition:0.1s;}.UI_pop_close:hover{color:#888;text-decoration:none;}.UI_pop_close:active{color:#444}.UI_confirm{_border:1px solid #eee;position:absolute;background:#fff;border-radius:4px;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}.UI_confirm_text{padding:30px 10px 20px;line-height:26px;text-align:center;font-size:20px;color:#333;}.UI_ask{_border:1px solid #eee;position:absolute;background:#fff;border-radius:4px;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}.UI_ask_text{padding:25px 10px 15px;line-height:26px;text-align:center;font-size:18px;color:#333;}.UI_ask input{display:block;margin:0px auto 15px;height:30px;padding:4px 4px;line-height:22px;box-sizing:border-box;width:90%;}.UI_miniChatSlideCnt{width:220px;height:0px;overflow:hidden;position:absolute;border-radius:4px;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}.UI_miniChat{position:absolute;left:0px;bottom:0px;width:100%;_border:1px solid #eee;background:#fff;overflow:hidden;}.UI_miniChat_text{padding:20px 10px 10px;box-sizing:content-box;line-height:24px;text-align:center;font-size:14px;color:#333;}.UI_miniChat .UI_pop_confirm a{height:28px;line-height:28px;}.UI_pop_confirm{overflow:hidden;text-align:center;border-top:1px solid #ddd;}.UI_pop_confirm a{display:block;width:50%;height:36px;float:left;font-size:14px;line-height:36px;color:#03f;box-sizing:border-box;}.UI_pop_confirm_ok{border-right:1px solid #ddd;}.UI_pop_confirm a:hover{text-decoration:none;}.UI_plane{width:200px;position:absolute;top:400px;left:300px;}.UI_prompt{width:240px;position:absolute;left:50%;margin-left:-130px;padding:30px 10px;box-sizing:content-box;background:#fff;_border:1px solid #fafafa;border-radius:4px;box-shadow:2px 2px 10px rgba(0,0,0,0.5);}.UI_cnt{font-size:18px;color:#222;text-align:center;}.UI_cover{position:absolute;top:0px;left:0px;width:100%;height:100px;}.UI_coverCnt{position:relative;width:100%;height:100%;background:#fff;}.UI_coverClose{display:block;position:absolute;top:50%;left:0px;width:20px;height:60px;padding-left:5px;text-align:center;line-height:60px;color:#ddd;font-family:"Simsun";font-size:30px;background:#555;}.UI_coverClose:hover{background-color:#333;color:#fff;text-decoration:none;}.UI_select{position:absolute;width:100%;bottom:0px;padding-bottom:10px;}.UI_select a{display:block;height:40px;line-height:40px;text-align:center;color:#03f;font-size:16px;}.UI_select_body{margin:0px 10px 10px;border-radius:8px;overflow:hidden;background:#fff;}.UI_selectCpt{padding:8px 0px;}.UI_selectCpt h3,.UI_selectCpt p{margin:0px;font-size:15px;line-height:18px;text-align:center;color:#aaa;font-weight:normal;}.UI_selectCpt p{font-size:12px;}.UI_selectCnt a{border-top:1px solid #eee;margin-top:-1px;}.UI_selectCancel{margin:0px 10px;border-radius:8px;overflow:hidden;background:#fff;}.UI_fixedScreenBottom_cnt .UI_confirm{width:100%;width:100%;left:0px;bottom:0;border-radius:0px;box-shadow:0px 0px 5px rgba(0,0,0,0.8);}.UI_fixedScreenBottom_cnt .UI_confirm_text{padding:50px 10px;font-size:18px}.UI_fixedScreenBottom_cnt .UI_confirm .UI_pop_confirm{width:100%;padding:10px 0px 30px}.UI_fixedScreenBottom_cnt .UI_confirm a{display:block;height:40px;line-height:40px;border-radius:22px;margin:0px 20px;font-size:16px}.UI_fixedScreenBottom_cnt .UI_confirm a.UI_pop_confirm_ok{margin-bottom:15px;}</style>';
	
	var isIE67 = false;
	if(navigator.appName == "Microsoft Internet Explorer"){
		var version = navigator.appVersion.split(";")[1].replace(/[ ]/g,"");
		if(version == "MSIE6.0" || version == "MSIE7.0"){
			isIE67 = true; 
		}
	}
	
	/**
	 * 定义私有变量
	 * 
	 **/ 
	var private_allCnt = utils.createDom(allCnt_tpl)[0],
		private_maskDom = utils.findByClassName(private_allCnt,'UI_mask')[0],
		private_mainDom = utils.findByClassName(private_allCnt,'UI_main_cnt')[0],
		private_fixedScreenTopDom = utils.findByClassName(private_allCnt,'UI_fixedScreenTop_cnt')[0],
		private_fixedScreenBottomDom = utils.findByClassName(private_allCnt,'UI_fixedScreenBottom_cnt')[0],
		private_cssDom = utils.createDom('<style type="text/css" data-module="UI_plug" ></style>')[0],
		private_window = window,
		private_winW,
		private_winH,
		private_doc = document,
		private_docH,
		private_scrollTop,
		private_isSupportTouch = "ontouchend" in document ? true : false,
		private_maskCount = 0;

	var private_CONFIG = {
		'gap' : {
			'top' : 0,
			'left' : 0,
			'bottom' : 0,
			'right' : 0
		},
		'zIndex' : 499
	};
	
	
	
	function refreshSize(){
		//重新计算窗口尺寸
		private_winW = document.body.scrollWidth;
		private_scrollTop = document.body.scrollTop;
		private_winH = window.innerHeight;
		private_docH = document.body.scrollHeight;
		
		//向css环境写入动态css
		private_cssDom.innerHTML = [
			'.UI_cover{height:' + private_winH + 'px;}',
			'.UI_ask{top:' + (private_winH/2) + 'px;}',
			'.UI_mask{height:' + private_winH + 'px;}'
		].join('');
	}
	
	function build_UI_DOM(){
		document.head.appendChild(utils.createDom(popCSS)[0]);
		document.head.appendChild(private_cssDom);
		document.body.appendChild(private_allCnt);
		//释放掉无用的内存
		popCSS = null;
		allCnt = null;
		
		//更新窗口尺寸
		refreshSize();
		setTimeout(refreshSize,500);
		var rebuild_fn = null;
		/**
		 *	fix Prompt Mask position & size 
		 */ 
		if(isIE67){
			utils.css(private_fixedScreenTopDom,{'top' : private_scrollTop});
			utils.css(private_fixedScreenBottomDom,{'top' : private_scrollTop + private_winH});
			
			rebuild_fn = function(){
				refreshSize();
				utils.css(private_fixedScreenTopDom,{'top' : private_scrollTop});
				utils.css(private_fixedScreenBottomDom,{'top' : private_scrollTop + private_winH});
				utils.css(private_maskDom,{'top' : private_scrollTop});
			};
		}else{
			utils.css(private_fixedScreenTopDom,{
				'position' : 'fixed',
				'top' : 0
			});
			utils.css(private_fixedScreenBottomDom,{
				'position' : 'fixed',
				'bottom' : 0
			});
			rebuild_fn = refreshSize;
		}
		//监听浏览器缩放、滚屏事件
		utils.bind(private_window,'resize',rebuild_fn);
		utils.bind(private_window,'scroll',rebuild_fn);
	}
	
	utils.ready(function(){
		build_UI_DOM();
	});
	
	
	
	//通用拖动方法
	function drag(handle_dom,dom,param){
		var param = param || {};
		var moving = param['move'] || null;
		var start = param['start'] || null;
		var end = param['end'] || null;
		var dragMask = utils.createDom(dragMask_tpl)[0];

		var dx, dy,l_start,t_start,w_start,h_start;
		utils.bind(handle_dom,'mousedown',function(e){
			if(e.button == 0){
				down(e);
			}
		});
		function down(e){
			//更新窗口尺寸
			refreshSize();
//			e.preventDefault();
//			e.stopPropagation();
			dx = e.pageX;
			dy = e.pageY;
			l_start = parseInt(utils.getStyle(dom,'left'));
			t_start = parseInt(utils.getStyle(dom,'top'));
			w_start = parseInt(utils.outerWidth(dom));
			h_start = parseInt(utils.outerHeight(dom));
			
			utils.bind(document,'mousemove',move);
			utils.bind(document,'mouseup',up);
			
			utils.css(dragMask,{
				'width' : private_winW,
				'height' : private_winH,
				'cursor' : utils.getStyle(handle_dom,'cursor')
			});
			private_fixedScreenTopDom.appendChild(dragMask);
			start&&start();
		}
		function move(e){
			e.preventDefault();
			e.stopPropagation();
		//	window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();
			moving&&moving(e.pageX-dx,e.pageY-dy,l_start,t_start,w_start,h_start);
		}
		function up(e) {
			dragMask.remove();
			utils.unbind(document,'mousemove',move);
			utils.unbind(document,'mouseup',up);
			end&&end();
		}
	}
	//通用限制位置区域的方法
	function fix_position(top,left,width,height){
		var gap = private_CONFIG.gap;
		if(top<private_scrollTop + gap.top){
			//Beyond the screen(top)
			top = private_scrollTop  + gap.top;
		}else if(top + height - private_scrollTop > private_winH - gap.bottom) {
			//Beyond the screen(bottom)
			if(height > private_winH - gap.top - gap.bottom){
				//Is higher than the screen
				top = private_scrollTop + gap.top;
			}else{
				//Is shorter than the screen
				top = private_scrollTop + private_winH - height - gap.bottom;
			}
		}
		if(left < gap.left){
			left =  gap.left;
		}else if(left + width > private_winW - gap.right){
			left = private_winW - width - gap.right;
		}
		return {
			'top' : top,
			'left' : left
		}
	}
	//计算自适应页面位置的方法
	function adaption(width,height){
		var top = (private_winH - height)/2 + private_scrollTop;
		var left = (private_winW - width)/2;
		var newPosition = fix_position(top,left,width,height);

		var gap = private_CONFIG.gap;
		var clientTop = (private_winH - height)/2;
		if(clientTop<gap.top){
			clientTop = gap.top;
		}
		return {
			'top' : newPosition.top,
			'left' : newPosition.left,
			'clientTop' : clientTop,
			'clientLeft' : newPosition.left
		}
	}
	
	//增加确认方法
	function add_confirm(dom,param,close){
		var callback = null;
		var cancel = null;
		var btns = ['\u786E\u8BA4','\u53D6\u6D88'];
		if(typeof(param) == "function"){
			callback = param;
		}else if(typeof(param) == "object"){
			if(param['btns']){
				btns[0] = param['btns'][0];
				btns[1] = param['btns'][1];
			}
			if(typeof(param['callback']) == "function"){
				callback = param['callback'];
			}
			if(typeof(param['cancel']) == "function"){
				cancel = param['cancel'];
			}
		}
		var this_html = confirmBar_tpl.replace(/{(\w+)}/g,function(){
			var key = arguments[1];
			if(key == 'confirm'){
				return btns[0]
			}else if(key == 'cancel'){
				return btns[1]
			}
		});
		dom.appendChild(utils.createDom(this_html)[0]);
		
		//点击确认按钮
		var ok_dom = utils.findByClassName(dom,'UI_pop_confirm_ok')[0];
		utils.bind(ok_dom,'click',function(){
			if(callback){
				//根据执行结果判断是否要关闭弹框
				var result = callback();
				if(result != false){
					close();
				}
			}else{
				close();
			}
		});
		//点击取消按钮
		var cancel_dom = utils.findByClassName(dom,'UI_pop_confirm_cancel')[0];
		utils.bind(cancel_dom,'click',function(){
			if(cancel){
				//根据执行结果判断是否要关闭弹框
				var result = cancel();
				if(result != false){
					close();
				}
			}else{
				close();
			}
		});
	}
	
	/**
	 * 显示蒙层 
	 */
	function showMask(){
		private_maskCount++
		if(private_maskCount==1){
			utils.fadeIn(private_maskDom,100);
		}
	}
	/**
	 * 可定制关闭方法
	 *  
	 */
	function CLOSEMETHOD(effect_define,time_define){
		var default_effect = effect_define || null;
		var default_time = time_define;
		
		return function(effect,time){
			effect = effect || default_effect;
			time = parseInt(time || default_time) || 80;
			
			//处理关闭回调、蒙层
			this.closeFn && this.closeFn();
			if(this._mask){
				private_maskCount--
				if(private_maskCount==0){
					utils.fadeOut(private_maskDom,80);
				}
			}
			
			var DOM = this.dom;
			if(!effect){
				DOM.remove();
			}else{
				if(effect == 'fade'){
					utils.fadeOut(DOM,time,function(){
						DOM.remove();
					});
				}else if(effect == 'slide'){
					utils.slideUp(DOM,time,function(){
						DOM.remove();
					});
				}else if(effect == 'zoomOut'){
					var width = parseInt(utils.getStyle(DOM,'width'));
					var height = parseInt(utils.getStyle(DOM,'height'));
					var marginLeft = parseInt(utils.getStyle(DOM,'marginLeft'));
					var marginTop = parseInt(utils.getStyle(DOM,'marginTop'));
					utils.animation(DOM,{
						'width' : width/2,
						'height' : height/2,
						'overflow' : 'hidden',
						'marginLeft' : (marginLeft + width/4),
						'marginTop' : (marginTop + height/4),
						'opacity' : 0
					},time,function(){
						DOM.remove();
					});
				}
			}
		}
	}
	
	/**
	 * 弹框
	 * pop 
	 */
	function POP(param){
		var param = param || {};
		var this_pop = this;
		
		this.dom = utils.createDom(pop_tpl)[0];
		this.cntDom = utils.findByClassName(this.dom,'UI_pop_cnt')[0];
		this.closeFn = param['closeFn'] || null;
		this._mask = param['mask'] || false;

		var this_html = param['html'] || '';
		var this_width = param['width'] || Math.min(600,private_winW-20);
		var this_height = param['height'] ? parseInt(param['height']) : null;

		//预定高度时
		if(this_height){
			utils.css(this.cntDom,{
				'height' : this_height - 41
			});
		}

		//当有确认参数时
		if(param['confirm']){
			add_confirm(this.dom,param['confirm'],function(){
				this_pop.close();
			});
		}
		//处理title参数
		var caption_dom = utils.findByClassName(this.dom,'UI_pop_cpt')[0];
		if(!param['title']){
			caption_dom.remove();
		}else{
			var title = param['title'] || '\u8BF7\u8F93\u5165\u6807\u9898';
			
			caption_dom.innerHTML = title;
			//can drag is pop
			UI.drag(caption_dom,this.dom,{
				'move' : function(dx,dy,l_start,t_start,w_start,h_start){
					var top = dy + t_start;
					var left = dx + l_start;
					var newSize = fix_position(top,left,w_start,h_start);
					utils.css(this_pop.dom,{
						'left' : newSize.left,
						'top' : newSize.top
					});
				}
			});
		}


		//insert html
		this.cntDom.innerHTML = this_html;
		private_mainDom.appendChild(this.dom);
		
		//fix position get size
		var fixSize = adaption(this_width,(this_height?this_height:utils.outerHeight(this.dom)));
		var top = (param['top'] == +param['top']) ? param['top'] : fixSize.top;
		var left = (param['left'] == +param['left']) ? param['left'] : fixSize.left;
		
		// create pop
		utils.css(this.dom,{
			'width' : this_width,
			'left' : left,
			'top' : top - 100,
			'opacity' : 0
		});
		utils.animation(this.dom,{
			'top' : top,
			'opacity' : 1
		},100,'Sine.easeOut');
		
		var close_dom = utils.findByClassName(this.dom,'UI_pop_close')[0];
		utils.bind(close_dom,'click',function(){
			this_pop.close();
		})
		
		if(this._mask){
			showMask();
		}
		
	}
	//使用close方法
	POP.prototype['close'] = CLOSEMETHOD('zoomOut',150);
	POP.prototype['adapt'] = function(){
		var width = utils.outerWidth(this.dom);
		var height = utils.outerHeight(this.dom);
		
		var fixSize = adaption(width,height);
		utils.animation(this.dom,{
			'top' : fixSize.top,
			'left' : fixSize.left
		}, 100);
	};

	/**
	 * CONFIRM 
	 */
	function CONFIRM(param){
		var param = param || {};
		var this_pop = this;

		var this_text = param['text'] || '\u8BF7\u8F93\u5165\u786E\u8BA4\u4FE1\u606F！';
		var callback = param['callback'] || null;
		var this_html = confirm_tpl.replace(/{text}/,this_text);
		this._mask = true;
		this.dom = utils.createDom(this_html)[0];
		this.closeFn = param['closeFn'] || null;
		
		//显示蒙层
		showMask();
		add_confirm(this.dom,param,function(){
			this_pop.close();
		});
		var newPosition = adaption(300,160);
		// create pop
		utils.css(this.dom,{
			'width' : 300,
			'left' : newPosition.clientLeft,
			'top' : newPosition.clientTop - 100
		});
		utils.animation(this.dom,{
			'opacity' : 1,
			'top' : newPosition.clientTop
		},100,'Back.easeOut');
		private_fixedScreenTopDom.appendChild(this.dom);

	}
	CONFIRM.prototype['close'] = CLOSEMETHOD('fade');


	/**
	 * ASK 
	 */
	function ASK(text,callback){
		var this_pop = this;

		var this_text = text || '\u8BF7\u8F93\u5165\u786E\u8BA4\u4FE1\u606F！';
		var this_html = ask_tpl.replace(/{text}/,this_text);

		this.dom = utils.createDom(this_html)[0];
		this.inputDom = utils.findByClassName(this_pop.dom,'UI_ask_key')[0];
		this.closeFn =  null;
		this.callback = callback || null;

		var this_html = confirmBar_tpl.replace(/{(\w+)}/g,function(a,key){
			if(key == 'confirm'){
				return '确定';
			}else if(key == 'cancel'){
				return '取消';
			}
		});
		this.dom.appendChild(utils.createDom(this_html)[0]);
		
		//确定
		var ok_dom = utils.findByClassName(this.dom,'UI_pop_confirm_ok')[0];
		utils.bind(ok_dom,'click',function(){
			var value = this_pop.inputDom.value;
			if(this_pop.callback){
				//根据执行结果判断是否要关闭弹框
				var result = this_pop.callback(value);
				if(result != false){
					this_pop.close();
				}
			}else{
				this_pop.close();
			}
		});
		
		//取消
		var cancel_dom = utils.findByClassName(this.dom,'UI_pop_confirm_cancel')[0];
		utils.bind(cancel_dom,'click',function(){
			this_pop.close();
		});

		var newPosition = adaption(300,160);
		// create pop
		utils.css(this.dom,{
			'width' : 300,
			'opacity' : 0,
			'left' : newPosition.clientLeft,
			'marginTop' : -200
		});
		utils.animation(this.dom,{
			'opacity' : 1,
			'marginTop' : -100
		},100,'Back.easeOut');

		private_fixedScreenTopDom.appendChild(this.dom);
	}
	ASK.prototype['close'] = CLOSEMETHOD('fade');
	ASK.prototype['setValue'] = function(text){
		var text = text ? text.toString() : '';
		this.inputDom.value = text;
	};


	/**
	 * prompt
	 * 
	 **/
	function prompt(txt,time){
		var this_prompt = this;
		var txt = txt || '\u8BF7\u8F93\u5165\u5185\u5BB9';
		this.dom = utils.createDom(prompt_tpl)[0];

		this.tips(txt,time);
		
		var newPosition = adaption(260,100);
		// create pop
		
		utils.css(this.dom,{
			'top' : 0,
			'opacity' : 0
		});
		utils.animation(this.dom,{
			'top' : newPosition.clientTop,
			'opacity' : 1
		},140,'Back.easeOut');
		//console.log(private_winH,12);
		private_fixedScreenTopDom.appendChild(this.dom);
	}
	prompt.prototype['close'] = CLOSEMETHOD('zoomOut',150);
	prompt.prototype['tips'] = function(txt,time){
		var this_prompt = this;
		if(txt){
			utils.findByClassName(this.dom,'UI_cnt')[0].innerHTML = txt;
		}
		if(time == 0){
			return
		}
		setTimeout(function(){
			this_prompt.close(time);
		},(time || 1500));
	};

	/**
	 *	PLANE 
	 */
	//the active plane
	private_activePlane = null;
	/**
	 * 简单的事件委托模型 
	 */
	function checkClick(event) {
		var target = event.target;
		while (!utils.hasClass(target,'UI_plane')) {
			target = target.parentNode;
			if(!target){
		//		console.log('not target')
				//close the active plane
				private_activePlane&&private_activePlane.close();
				break
			}
		}
	//	console.log('target',target)
	}
	
	if(private_isSupportTouch){
		//移动端使用touch
		var doc = private_doc;
		doc.addEventListener('touchstart',checkClick);
		doc.addEventListener('MSPointerDown',checkClick);
		doc.addEventListener('pointerdown',checkClick);
	}else{
		//PC鼠标事件
		utils.bind(document,'mousedown',checkClick);
	}
	
	
	function PLANE(param){
		//如果有已展开的PLANE，干掉他
		private_activePlane&&private_activePlane.close();
		private_activePlane = this;

		var param = param || {};
		var this_plane = this;		

		var this_html = param['html'] || '';
		this.closeFn = param['closeFn'] || null;

		this.dom = utils.createDom(plane_tpl)[0];

		//insert html
		this.dom.innerHTML = this_html;
		
		utils.css(this.dom,{
			'width' : param['width'] || 240,
			'height' :param['height'] || null,
			'top' : param['top'] || 300,
			'left' : param['left'] || 800
		});
		private_mainDom.appendChild(this.dom);
	}
	PLANE.prototype['close'] = CLOSEMETHOD();

	/**
	 *	miniChat 
	 */

	function miniChat(param){
		var param = param || {};
		var this_chat = this;

		var text = param['text'] || '\u8BF7\u8F93\u5165\u6807\u9898';
		var this_tpl = miniChat_tpl.replace('{text}',text);
		
		this.dom = utils.createDom(this_tpl)[0];
		this.closeFn = param['closeFn'] || null;
		
		//视觉上的弹框（仅为dom的一部分）
		var visual_box = utils.findByClassName(this.dom,'UI_miniChat')[0];
		//当有确认参数时
		add_confirm(visual_box,param,function(){
			this_chat.close('slide');
		});
		

		var fixSize = adaption(220,110);
		
		var top = typeof(param['top']) == 'number' ? param['top'] : fixSize.top;
		var left = typeof(param['left']) == 'number' ? param['left'] : fixSize.left;

		// create pop
		utils.css(this.dom,{
			'left' : left,
			'top' : top
		});
		
		private_mainDom.appendChild(this.dom);
		var height = utils.outerHeight(visual_box);
		
		utils.animation(this.dom,{
			'height' : height
		}, 100);
		
	}
	miniChat.prototype['close'] = CLOSEMETHOD();



	/***
	 * 全屏弹框
	 * COVER 
	 */
	function COVER(param){
		var param = param || {};
		var this_cover = this;
		this.dom = utils.createDom(cover_tpl)[0];
		this.cntDom = utils.findByClassName(this.dom,'UI_coverCnt')[0];
		this.closeDom = utils.findByClassName(this.dom,'UI_coverClose')[0];
		this.closeFn = param['closeFn'] || null;

		var this_html = param['html'] || '';
		//insert html
		this.cntDom.innerHTML = this_html;
		
		utils.bind(this.closeDom,'click',function(){
			this_cover.close();
		});

		utils.hide(this.closeDom);
		// create pop
		utils.css(this.cntDom,{
			'left' : private_winW*2/3,
			'opacity' : 0
		});
		utils.animation(this.cntDom,{
			'left' : 0,
			'opacity' : 1
		}, 80,function(){
			utils.fadeIn(this_cover.closeDom,100);
		});
		
		private_fixedScreenTopDom.appendChild(this.dom);
	}
	//使用close方法
	COVER.prototype['close'] = function(){
		var dom_all = this.dom;
		
		utils.fadeOut(this.closeDom,80);
		utils.animation(this.cntDom,{
			'left' : private_winW/2,
			'opacity' : 0
		},120, function(){
			dom_all.remove();
		});
	};

	/**
	 * 选择功能
	 */
	function SELECT(list,param){
		var this_sel = this;
		
		var list = list || [];
		var param = param || {};
		
		var caption_html = '';
		if(param.title){
			caption_html += '<div class="UI_selectCpt">';
			if(param.title){
				caption_html += '<h3>' + param.title + '</h3>';
			}
			if(param.intro){
				caption_html += '<p>' + param.intro + '</p>';
			}
			caption_html += '</div>';
		}
		
		var fns = [];
		var list_html = '';
		for(var i=0,total=list.length;i<total;i++){
			list_html += '<a class="UI_select_btn" href="javascript:void(0)">' + list[i][0] + '</a>';
			fns.push(list[i][1]);
		}
		var this_html = select_tpl.replace(/\{(\w+)\}/g,function(a,b){
			if(b == 'list'){
				return list_html;
			}else if(b == 'caption'){
				return caption_html;
			}
		});
		
		this.dom = utils.createDom(this_html)[0];
		this._mask = true;
		
		
		//显示蒙层
		showMask();
		
		utils.css(this.dom,{
			'bottom' : -100,
			'opacity' : 0
		});
		
		private_fixedScreenBottomDom.appendChild(this.dom);
		
		utils.animation(this.dom, {
			'bottom' : 0,
			'opacity' : 1
		}, 300, 'Bounce.easeOut');
		var btns = utils.findByClassName(this.dom,'UI_select_btn');
		for(var i=0,total=btns.length;i<total;i++){
			(function(index){
				utils.bind(btns[index],'click',function(){
					fns[index] && fns[index]();
					this_sel.close();
				});
			})(i);
		}
	}
	SELECT.prototype['close'] = CLOSEMETHOD('slide',200);
	/**
	 *  抛出对外接口
	 */
	return {
		'pop' : function(){
			return new POP(arguments[0]);
		},
		'config' : {
			'gap' : function(name,value){
				if(name && name.match(/(top|right|bottom|left)/)){
					if(parseInt(value)){
						private_CONFIG.gap[name] = value;
					}
				}
			},
			'zIndex' : function(num){
				var num = parseInt(num);
				if(num > 0){
					private_CONFIG.zIndex = num;
					utils.css(private_allCnt,{
						'zIndex':num
					});
					utils.css(private_fixedScreenBottomDom,{
						'zIndex':num
					});
					utils.css(private_fixedScreenTopDom,{
						'zIndex':num
					});
				}
			}
		},
		'miniChat' : function(){
			return new miniChat(arguments[0]);
		},
		'confirm' : function(){
			return new CONFIRM(arguments[0]);
		},
		'ask' : function(text,callback){
			return new ASK(text,callback);
		},
		'prompt' : function(txt,time){
			return new prompt(txt,time);
		},
		'plane' : function(){
			return new PLANE(arguments[0]);
		},
		'cover' : function(){
			return new COVER(arguments[0]);
		},
		'select' : function(){
			return new SELECT(arguments[0],arguments[1]);
		},
		'drag' : drag
	};
},function () {
    var Tween = {
        Linear: function (t, b, c, d) { return c * t / d + b; },
        Quad: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            easeOut: function (t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            }
        },
        Cubic: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        },
        Quart: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            }
        },
        Quint: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            }
        },
        Sine: {
            easeIn: function (t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOut: function (t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOut: function (t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            }
        },
        Expo: {
            easeIn: function (t, b, c, d) {
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOut: function (t, b, c, d) {
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if (t == 0) return b;
                if (t == d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        },
        Circ: {
            easeIn: function (t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOut: function (t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            }
        },
        Elastic: {
            easeIn: function (t, b, c, d, a, p) {
                if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
                if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOut: function (t, b, c, d, a, p) {
                if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
                if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
            },
            easeInOut: function (t, b, c, d, a, p) {
                if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
                if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            }
        },
        Back: {
            easeIn: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOut: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOut: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            }
        },
        Bounce: {
            easeIn: function (t, b, c, d) {
                return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
            },
            easeOut: function (t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            easeInOut: function (t, b, c, d) {
                if (t < d / 2){
					return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
				}else{
					return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
				}
            }
        }
    }

    var color = {
        sub: function (str, start, len) {
            if (len) return str.substring(start, start + len);
            else return str.substring(start);
        },
        hex: function (i) {  // 返回16进制颜色表示
            if (i < 0) return "00";
            else if (i > 255) return "ff";
            else { var str = "0" + i.toString(16); return str.substring(str.length - 2); }
        },
        //获取颜色数据    
        GetColors: function (sColor) {
            sColor = sColor.replace("#", "");
            var r, g, b;
            if (sColor.length > 3) {
                r = color.sub(sColor, 0, 2); g = color.sub(sColor, 2, 2); b = color.sub(sColor, 4, 2);
            } else {
                r = color.sub(sColor, 0, 1); g = color.sub(sColor, 1, 1); b = color.sub(sColor, 2, 1);
                r += r; g += g; b += b;
            }
            return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
        }
    }
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
 	 * 遍历数组或对象
	 * 
	 */
	function each(arr,fn){
		//检测输入的值
		if(typeof(arr) == 'object' && typeof(fn) == 'function'){
			if(typeof(arr.length) != undefined){
				for(var i=0,total=arr.length;i<total;i++){
					fn.call(this,i,arr[i]);
				}
			}else{
				for(var i in arr){
					fn.call(this,i,arr[i]);
				}
			}
		}
	}
	/**
	 * 判断dom是否拥有某个class
	 */
	function hasClass(dom,classSingle){
		//dom有class 检测，无class，直接返回false
		return (dom.className && dom.className.length) ? dom.className.match(new RegExp('(\\s|^)' + classSingle +'(\\s|$)')) : false;
	}
	//获取样式
	function getStyle(elem, attr) {
		var w3style;
		attr == "borderWidth" ? attr = "borderLeftWidth" : attr;
		if (elem.style[attr]){
			w3style = elem.style[attr];
		} else if(document.defaultView) {
			var style = document.defaultView.getComputedStyle(elem, null);
			w3style = attr in style ? style[attr] : style.getPropertyValue(attr);
		} else if (elem.currentStyle) {
			w3style = elem.currentStyle[attr];
		}
		//w3style == "auto" ? w3style = "0px" : w3style;
		return w3style;
	}
	
	// 此处只能获取属性值为数值类型的style属性
	function getOriCss (elem, cssObj) {
		var cssOri = [];
		for (var prop in cssObj) {
			if (!cssObj.hasOwnProperty(prop)){
				continue;
			}
			
			var value = getStyle(elem, prop);
			
			if (value == "transparent") {
				value = [255, 255, 255,0];
			}else if (/^#/.test(value)) {
				value = color.GetColors(value);
			} else if (/^rgb/.test(value)) {
				//获得css值为rgba或rgb对应值（数组）
				value = value.match(/([0-9]+)/g);
			} else if (prop == "opacity") {
				value = 100 * value;
			} else {
				value = parseInt(value);
			}
			
			cssOri.push(value);
		}
		return cssOri;
	}
    function parseCssObj (cssobj) {
		var cssEnd = [];
		for (var prop in cssobj) {
			if (!cssobj.hasOwnProperty(prop)) continue;
			//if (prop != "opacity") cssEnd.push(parseInt(cssobj[prop]));
			//else cssEnd.push(100 * cssobj[prop]);
			if (prop == "opacity") {
				cssEnd.push(100 * cssobj[prop]);
			} else if (/^#/.test(cssobj[prop])) {
				cssEnd.push(color.GetColors(cssobj[prop]));
			} else {
				cssEnd.push(parseInt(cssobj[prop]));
			}
		}
		return cssEnd;
	}

	/**
	 * dom设置样式
	 */
	function setStyle(elem,prop,value){
		if(value == null){
			return
		}
		prop = prop.toString();
		if (prop == "opacity") {
			value = value / 100;
		} else if (value == +value){
			value = value + "px";
		}
		
		elem.style[prop] = value;
	}
	//设置css
	function setCss(dom,cssObj){
		var cssVal = parseCssObj(cssObj);
		
		for (var pro in cssObj) {
			if (!cssObj.hasOwnProperty(pro)){
				continue;
			}
			setStyle(dom,pro,cssObj[pro]);
		}
		
	}
	var requestAnimationFrame = (function () {
        return  window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				function (callback) {
					return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
				};
    })();
	/**
	 * 动画类
	 *
	 */
    function anim() {
		var args = arguments;
        this.elem = args[0];
		this.cssObj = args[1];
		this.cssOri = getOriCss(this.elem, args[1]);
		this.cssEnd = parseCssObj(args[1]);
		this.durtime = args[2];
		this.animType = "Linear";
		this.onPause = null;
		this.onEnd = null;
		if (args.length < 3) {
			throw new Error("missing arguments [dom,cssObj,durtime]");
		} else {
			if (TypeOf(args[3]) == "Function") {
				this.onEnd = args[3];
			}else if (typeof (args[3]) == "string") {
				this.animType = args[3];
			}
			
			if (TypeOf(args[4]) == "Function") {
				this.onEnd = args[4];
			}
		}
		this.animType = 'Tween.' + this.animType;
		this.startAnim();
    }
    anim.prototype = {
        startAnim: function () {
            var that = this;
            //当前帧
			var cur_frame = 0;
			//所有帧数
			var all_frame = Math.ceil(that.durtime / (1000/60));
            //获得需要操作的属性名
			var props = [];
            for (var pro in this.cssObj) {
                if (!this.cssObj.hasOwnProperty(pro)){
					continue;
				}
                props.push(pro);
            }
			//取得运动曲线方程
			var aniFunction = (eval(that.animType));
			
			//显示当前帧（递归）
			function showFrame(){
				cur_frame++;
				
				for (var i = 0; i < props.length; i++) {
					var value = countNewCSS(that.cssOri[i],that.cssEnd[i],cur_frame,all_frame,aniFunction);
					setStyle(that.elem,props[i],value);
				}
				
				if (cur_frame < all_frame) {
					requestAnimationFrame(showFrame);
				}else{
					that.onEnd && that.onEnd.call(that, that.elem);
				}
			}
			requestAnimationFrame(showFrame);
        },
        pause: function () {
            this.onPause = true;
        }
    }
	//给定计算方式，得出新的CSS值
	function countNewCSS(start,end,cur_frame,all_frame,fn){	
		var output
		if (TypeOf(start) == "Array" && TypeOf(end) == "Array") {
			//rgb初始值
			var r_s = start[0],
				g_s = start[1],
				b_s = start[2];
			//rgb变化差值
			var r_m = end[0] - r_s,
				g_m = end[1] - g_s,
				b_m = end[2] - b_s;
			//新的rgb值
			var r_n = Math.ceil(fn(cur_frame, r_s, r_m, all_frame)),
				g_n = Math.ceil(fn(cur_frame, g_s, g_m, all_frame)),
				b_n = Math.ceil(fn(cur_frame, b_s, b_m, all_frame));
			
			if(start.length == 4 || end.length == 4){
				var a_s = start[3] || 100;
				var a_m = (end[3] || 100) - start[3];
				var a_n = fn(cur_frame, a_s, a_m, all_frame);
				output = 'rgba(' + r_n + ',' + g_n + ',' + b_n + ',' + (a_n/100) + ')';
			}else{
				output = 'rgba(' + r_n + ',' + g_n + ',' + b_n + ')';
			}
		} else {
			output = Math.ceil(fn(cur_frame, start, (end-start), all_frame));
		}
		return output
	}
	
	//创建dom
	function createDom(str){
		var a = document.createElement('div');
		a.innerHTML = str;
		return a.childNodes;
	}
	
	//读取dom在页面中的位置
	function offset(elem){
		var box = {
			'top' : 0,
			'left' : 0,
			'screen_top' : 0,
			'screen_left' : 0
		}
		var size;
		// Support: BlackBerry 5, iOS 3 (original iPhone)
		// If we don't have gBCR, just use 0,0 rather than error
		if ( typeof elem.getBoundingClientRect !== 'undefined' ) {
			size = elem.getBoundingClientRect();
		}
		box.top = size.top + document.body.scrollTop;
		box.left = size.left + document.body.scrollLeft;
		
		return box;
	}
	function outerWidth (elem){
		if ( typeof elem.getBoundingClientRect !== 'undefined' ) {
			return elem.getBoundingClientRect()['width'];
		}else{
			return (parseInt(getStyle(elem,'borderLeftWidth')) + parseInt(getStyle(elem,'paddingLeft')) + parseInt(getStyle(elem,'width')) + parseInt(getStyle(elem,'paddingRight')) + parseInt(getStyle(elem,'borderRightWidth')));
		}
	}
	function outerHeight (elem){
		if ( typeof elem.getBoundingClientRect !== 'undefined' ) {
			return elem.getBoundingClientRect()['height'];
		}else{
			return (parseInt(getStyle(elem,'borderTopWidth')) + parseInt(getStyle(elem,'paddingTop')) + parseInt(getStyle(elem,'height')) + parseInt(getStyle(elem,'paddingBottom')) + parseInt(getStyle(elem,'borderBottomWidth')));
		}
	}
	
	//根据class查找元素
	var findByClassName = (function(){
		if(document.getElementsByClassName !== 'undefined'){
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
	})();
	
	//隐藏dom
	function hide(elem){
		elem.style['display'] = 'none';
	}
	//淡出
	function fadeOut(DOM,time,fn){
		var op = getStyle(DOM,'opacity');
		new anim(DOM,{
			'opacity' : 0
		}, time,function(){
			DOM.style['opacity'] = op;
			DOM.style['display'] = 'none';
			fn && fn.call(DOM);
		});
	}
	//淡入
	function fadeIn(DOM,time,fn){
		var op = getStyle(DOM,'opacity');
		DOM.style['opacity'] = 0;
		DOM.style['display'] = 'block';
		new anim(DOM,{
			'opacity' : op
		}, time, function(){
			fn && fn.call(DOM);
		});
	}
	//滑入
	function slideDown(DOM,time,fn){
		DOM.style['overflow'] = 'hidden';
		DOM.style['opacity'] = 0;
		DOM.style['display'] = 'block';
		//FIXME padding
		new anim(DOM,{
			'height' : 0,
			'padding' : 0
		}, time, function(){
			fn && fn.call(DOM);
		});
	}
	//滑出
	function slideUp(DOM,time,fn){
		DOM.style['overflow'] = 'hidden';
		//FIXME padding
		new anim(DOM,{
			'height' : 0,
			'padding' : 0
		}, time,function(){
			DOM.style['display'] = 'none';
			fn && fn.call(DOM);
		});
	}
	
	
	
	/**
	 * 页面加载
	 */
	var readyFns = [];
	function completed() {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
		for(var i =0,total=readyFns.length;i<total;i++){
			readyFns[i]();
		}
		readyFns = null;
	}
	function ready(callback){
		if ( document.readyState === "complete" ) {
			callback && callback();
		} else {
			callback && readyFns.push(callback);
			document.addEventListener( "DOMContentLoaded", completed, false );
			window.addEventListener( "load", completed, false );
		}
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
	
    return{
		'css' : setCss,
		'slideDown' : slideDown,
		'slideUp' : slideUp,
		'fadeIn' : fadeIn,
		'fadeOut' : fadeOut,
		'animation' : function(a,b,c,d,e) {
			return new anim(a,b,c,d,e);
		},
		'createDom' : createDom,
		'findByClassName' : findByClassName,
		'hasClass' : hasClass,
		'offset' : offset,
		'getStyle' : getStyle,
		'outerWidth' : outerWidth,
		'outerHeight' : outerHeight,
		'ready' : ready,
		'bind' : bindHandler,
		'unbind' : removeHandler,
		'hide' : hide
    }
});