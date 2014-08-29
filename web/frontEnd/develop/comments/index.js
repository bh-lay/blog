

define(function(require,exports){
	var mirror = require('comments/mirror.js');
	var selection = require('comments/selection.js');
	var baseTpl = ['<div class="l_comments">',
		'<div class="l_com_sendBox"></div>',
		'<div class="l_com_list">',
		'</div>',
	'</div>'].join('');
	var sendBox_tpl = ['<div class="l_sendBox">',
		'<div class="l_sendBox_main">',
			'<div class="l_send_textarea">',
				'<textarea name="content" spellcheck="false"></textarea>',
				'<div class="l_send_placeholder">^_^ 写点啥吧！</div>',
			'</div>',
			'<div class="l_send_tools">',
				'<div class="l_send_tools_left">',
					'<a href="#" class="l_send_face"></a>',
				'</div>',
				'<div class="l_send_tools_right">',
					'<div class="l_send_count"><b></b><i>/</i><span>500</span></div>',
					'<a href="#" class="l_send_submit">发布</a>',
				'</div>',
			'</div>',
		'</div>',
		'<div class="l_sendBox_side">',
			'<div class="l_sendBox_avatar">',
				'<img src="http://layasset.qiniudn.com/user/default.jpg" />',
				'<a href="javascript:void(0)" class="l_send_login">雁过留名</a>',
			'</div>',
			'<div class="l_sendBox_name"></div>',
		'</div>',
	'</div>'].join('');
	var loginTpl = ['<div style="height:80px;background:#eee">',
		'<a href="#" class="login_account" >帐号登录</a>',
		'<a href="#" class="login_github" >github登录</a>',
	'</div>'].join('');
	
	var item_tpl = ['<div class="l_com_item">',
		'<%=content %>,<%=time %>,<%=uid %>',
	'</div>',].join('');
	
	//处理自定义事件
	function ON(eventName,callback){
		this._events = this._events || {};
		//事件堆无该事件，创建一个事件堆
		if(!this._events[eventName]){
			this._events[eventName] = [];
		}
		this._events[eventName].push(callback);
		//提供链式调用的支持
		return this;
	}
	function EMIT(eventName,args){
		this._events = this._events || {};
		//事件堆无该事件，结束运行
		if(!this._events[eventName]){
			return
		}
		for(var i=0,total=this._events[eventName].length;i<total;i++){
			this._events[eventName][i].apply(this.event_global || this,args);
		}
	}
	
	
	/**
	 * 设置头像
	 *
	 */
	function setAvatar(user){
		if(user && user.username){
			var $allDom = $(this.dom);
			$allDom.find('.l_sendBox_name').html(user.username);
			$allDom.find('.l_send_login').remove();
			if(user.avatar){
				$allDom.find('.l_sendBox_avatar img').attr('src',user.avatar);
			}
		}
	}
	/**
	 * 处理登录逻辑
	 */
	function loginHandle(btn){
		var me = this;
		var offset = btn.offset();
		var plane = UI.plane({
			'top' : offset.top,
			'left' : offset.left,
			'width' : 300,
			'from' : btn[0],
			'html' : loginTpl
		});
		function callbackHandle(data){
			if(data.code != 200){
				UI.prompt('登录失败',3000);
				return;
			}
			var user = data.user;
			//触发自定义事件“login”
			EMIT.call(me,'login',[user]);
		}
		$(plane.dom).on('mouseleave',function(){
			plane.close();
		}).on('click','.login_account',function(){
			plane.close();
			//帐号登录
			L.login('account',callbackHandle);
			return false;
		}).on('click','.login_github',function(){
			plane.close();
			//github登录
			L.login('github',callbackHandle);
			return false;
		});
			
	}
	/**
	 * 绑定dom事件
	 */
	function bindDomEvent(){
		
		var me = this;
		var $allDom = $(this.dom);
		var $textarea = $allDom.find('textarea');
		var $placeholder = $allDom.find('.l_send_placeholder');
		
		
		var delay;
		$textarea.on('keyup keydown change propertychange input paste',function(){
			clearTimeout(delay);
			delay = setTimeout(function(){
				var newVal = $textarea.val();
				if(newVal == me.text){
					return
				}
				me.text = newVal;
				//触发自定义事件“change”
				EMIT.call(me,'change');
			},80);
		});
		var focusDelay;
		$textarea.on('focus',function(){
			clearTimeout(focusDelay);
			$allDom.addClass('l_sendBox_active');
			$placeholder.fadeOut(100);
		}).on('focusout',function(){
			clearTimeout(focusDelay);
			focusDelay = setTimeout(function(){
				if(me.text.length == 0){
					$allDom.removeClass('l_sendBox_active');
					$placeholder.fadeIn(100);
				}
			},200);
		});
		
		
		$(this.dom).on('click','.l_send_placeholder',function(){
			$textarea.focus();
		}).on('mouseenter','.l_sendBox_avatar',function(){
			var btn = $(this);
			if(true){
				loginHandle.call(me,btn)
			}
		}).on('click','.l_send_tools',function(){
			$textarea.focus();
		});
	}
	//绑定对象自定义事件
	function bindCustomEvent(){
		var me = this;
		var $allDom = $(this.dom);
		var $textarea = $allDom.find('textarea');
		var $countRest = $allDom.find('.l_send_count b');
		var text_mirror = mirror($textarea);
		
		//监听字符变化事件
		this.on('change',function (){
			var height = text_mirror.refresh().realHeight;
			var overflow = 'hidden';
			if(height < 80){
				height = 80;
			}else if(height > 200){
				height = 200;
				overflow = 'visible';
			}
			$textarea.css({
				'height' : height,
				'overflow' : overflow
			});
			
			var length = $textarea.val().length;
			$countRest.html(me.limit - length);
		}).on('login',function(user){
			setAvatar.call(me,user);
		});
		
	}
	/**
	 * sendBox类
	 */
	function sendBox(dom,param){
		var me = this;
		var param = param || {};
		this.dom = $(sendBox_tpl)[0];
		this.limit = param.limit || 500;
		this.text = '';
		
		$(dom).html($(this.dom));
		
		//绑定dom事件
		bindDomEvent.call(this);
		//绑定对象自定义事件
		bindCustomEvent.call(this);
		L.dataBase.user(function(err,user){
			setAvatar.call(me,user);
		})
	}
	sendBox.prototype = {
		'on' : ON
	};
	
	/**
	 * 列表类
	 *
	 */
	function list(dom){
		this.list = [];
		this.skip = 0;
		this.limit = 30;
		this.total = 0;
		this._status = 'normal';
		this.dom = dom;
		
		this.getMore();
	}
	list.prototype.getMore = function(callback){
		if(this._status == 'loading'){
			return;
		}
		var me = this;
		this._status = 'loading';
		$.ajax({
			'url' : '/ajax/comments/list',
			'success' : function(data){
				if(data.code && data.code == 200){
					var DATA = data.data;
					me.total = DATA.count;
					me.list.concat(DATA.list);
					var html = '';
					for(var i=0,total=DATA.list.length;i<total;i++){
						html += me.render(DATA.list[i]);
					}
					$(me.dom).append(html);
					if(me.total == 0){
						$(me.dom).append('<div class="l_com_list_noData">来的真早，快抢沙发！</div>');
					}
				}
			}
		});
	};
	list.prototype.render = L.tplEngine(item_tpl);
	
	
	exports.sendBox = sendBox;
	exports.list = list;
	exports.init = function(dom){
		
		this.dom = $(baseTpl)[0];
		dom.html($(this.dom));
		
		this.sendBox = new sendBox($(this.dom).find('.l_com_sendBox')[0]);
		this.list = new list($(this.dom).find('.l_com_list')[0]);
	};
});