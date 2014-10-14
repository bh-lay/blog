

define(function(require,exports){
	var mirror = require('comments/mirror.js');
	var selection = require('comments/selection.js');
	var private_userInfo = null;
	
	var baseTpl = ['<div class="l_comments">',
		'<div class="l_com_sendBox"></div>',
		'<div class="l_com_list">',
		'</div>',
	'</div>'].join('');
	var sendBox_tpl = ['<div class="l_sendBox" spellcheck="false">',
		'<div class="l_sendBox_card">',
		'<div class="l_sendBox_card_front">',
			'<div class="l_send_textarea">',
				'<textarea name="content"></textarea>',
				'<div class="l_send_placeholder"><span></span>敢不敢留个言！</div>',
			'</div>',
			'<div class="l_send_footer">',
				'<div class="l_send_footer_left">',
					'<a href="#" class="l_send_face l_send_btnA">表情</a>',
					'<div class="l_send_count"><b>500</b><i>/</i><span>500</span></div>',
				'</div>',
				'<div class="l_send_footer_right">',
					'<a href="javascript:void(0)" class="l_send_btnB l_send_username l_send_toggle_flip">报上名来</a>',
					'<a href="javascript:void(0)" class="l_send_btnA l_send_submit">发布</a>',
				'</div>',
			'</div>',
			'<div class="l_send_avatar l_send_toggle_flip">',
				'<img src="http://layasset.qiniudn.com/user/default.jpg" />',
			'</div>',
		'</div>',
		'<div class="l_sendBox_card_back">',
			'<a href="javascript:void(0)" class="l_send_login_panel_close l_send_toggle_flip">×</a>',
			'<div class="l_send_login_panel">',
				'<div class="l_send_login_panel_body">',
					'<p><span>我是</span><input type="text" autocomplete="off" name="username" placeholder="韩梅梅"/></p>',
					'<p><span>有个常用邮箱</span><input type="text" autocomplete="off" name="email" placeholder="xxx@qq.cn"/></p>',
					'<p><span>还有一个牛逼轰轰的博客</span><input type="text" autocomplete="off" name="blog" placeholder="xxx.me"/></p>',
					'<p><a href="javascript:void(0)" class="l_send_changeUserInfo">确定</a></p>',
				'</div>',
			'</div>',
		'</div>',
		'</div>',
	'</div>'].join('');
	
	var item_tpl = ['<% for(var i=0,total=list.length;i<total;i++){%>',
		'<div class="l_com_item" data-uid="<%=list[i].uid %>">',
			'<div class="l_com_item_main">',
				'<div class="l_com_item_caption"><%=list[i].user.username || "匿名用户"%></div>',
				'<div class="l_com_item_content"><%=list[i].content %></div>',
				'<div class="l_com_item_footer">',
					'<div class="l_com_item_time"><%= list[i].time %></div>',
				'</div>',
			'</div>',
			'<div class="l_com_item_avatar">',
				'<img src="<% if(list[i].user.avatar){ %><%=list[i].user.avatar%><% }else{ %>http://layasset.qiniudn.com/user/default.jpg<% } %>"/>',
			'</div>',
		'</div>',
	'<%}%>'].join('');
	
	/**
	 * @param (timestamp/Date,'{y}-{m}-{d} {h}:{m}:{s}')
	 * 
	 * y:year
	 * m:months
	 * d:date
	 * h:hour
	 * i:minutes
	 * s:second
	 * a:day
	 */
	function parseTime(time,format){
		if(arguments.length==0){
			return null;
		}
		var format = format ||'{y}-{m}-{d} {h}:{i}:{s}';
		
		if(typeof(time) == "object"){
			var date = time;
		}else{
			var date = new Date(parseInt(time));
		}
		
		var formatObj = {
			y : date.getYear()+1900,
			m : date.getMonth()+1,
			d : date.getDate(),
			h : date.getHours(),
			i : date.getMinutes(),
			s : date.getSeconds(),
			a : date.getDay(),
		};
		
		var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g,function(result,key){
			var value = formatObj[key];
			if(result.length > 3 && value < 10){
				value = '0' + value;
			}
			return value || 0;
		});
		return time_str;
	}
	
	
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
	 * 设置用户信息
	 *
	 */
	function setUserInfoToUI(user){
		var $allDom = $(this.dom);
		if(user && user.username){
			$allDom.find('.l_send_placeholder span').html(user.username);
			$allDom.find('.l_send_username').html(user.username);
			$allDom.find('input[name="username"]').val(user.username).trigger('change');
			$allDom.find('input[name="email"]').val(user.email).trigger('change');
			$allDom.find('input[name="blog"]').val(user.blog).trigger('change');
			
			
			if(user.avatar){
				$allDom.find('.l_send_avatar img').attr('src',user.avatar);
			}
		}else{
			$allDom.find('.l_send_placeholder span').hide();
			$allDom.find('.l_send_avatar').hide();
		}
	}
	/**
	 * 显示登录界面
	 */
	var activeLoginPanel = null;
	function showLoginPanel($allDom){
		if(activeLoginPanel){
			activeLoginPanel.close();
			return;
		}
		var me = this;
		var offset = $allDom.offset();
		activeLoginPanel = L.login({
			'defaults' : 'account',
			'top' : offset.top - 20,
			'left' : offset.left + ($allDom.width() - 400)/2,
			'closeFn' : function(){
				activeLoginPanel = null;
			}
		},function (data){
			if(data.code != 200){
				UI.prompt('登录失败',3000);
				return;
			}
			var user = data.user;
			//触发自定义事件“login”
			EMIT.call(me,'login',[user]);
		});
	}
	/**
	 * 发送评论
	 *
	 */
	function sendComment(data,callback){
		$.ajax({
			'url' : '/ajax/comments/add',
			'type' : 'POST',
			'data' : {
				'id' : data.id,
				'content' : data.text,
				//如果为登录用户，则不发送用户信息
				'user' : (data.user.id ? null :  data.user)
			},
			'success' : function(data){
				if(data.code && data.code == 200){
					callback && callback(null,data.data);
				}else{
					callback && callback('fail');
				}
			}
		});
	}
	/**
	 * 绑定dom事件
	 */
	function bindDomEvent(){
		
		var me = this;
		var $allDom = $(this.dom);
		var $textarea = $allDom.find('textarea');
		
		
		var inputDelay,
			focusDelay;
		$textarea.on('keyup keydown change propertychange input paste',function(){
			clearTimeout(inputDelay);
			inputDelay = setTimeout(function(){
				var newVal = $.trim($textarea.val());
				//校验字符是否发生改变
				if(newVal == me.text){
					return
				}
				me.text = newVal;
				//触发自定义事件“change”
				EMIT.call(me,'change');
			},80);
		}).on('focus',function(){
			clearTimeout(focusDelay);
			$allDom.addClass('l_sendBox_active');
		}).on('focusout',function(){
			clearTimeout(focusDelay);
			focusDelay = setTimeout(function(){
				if(me.text.length == 0){
					$allDom.removeClass('l_sendBox_active');
				}
			},200);
		});
		
		$allDom.on('click','.l_send_placeholder',function(){
			$textarea.focus();
		}).on('click','.l_send_toggle_flip',function(e){
			var btn = $(this)[0];
			setTimeout(function(){
				$textarea.focusout();
			});
			//showLoginPanel.call(me,$allDom)
			$allDom.toggleClass('flipped');
		}).on('click','.l_send_footer',function(){
			$textarea.focus();
		}).on('click','.l_send_submit',function(){
			if(me.text.length == 0){
				UI.prompt('你丫倒写点东西啊！',null,{
					'top' : $(this).offset().top + 40
				});
			}else if(private_userInfo){
				sendComment({
					'id' : me.id,
					'text' : me.text,
					'user' : private_userInfo
				},function(err,data){
					if(err){
						//触发自定义事件“sendToServiceError”
						EMIT.call(me,'sendToServiceError');
					}else{
						EMIT.call(me,'sendToServicesuccess',[data]);
					}
				});
			}else{
				$allDom.toggleClass('flipped');
			}
			
		}).on('click','.l_send_face',function(){
			UI.prompt('表情正在开发中！');
		}).on('keyup keydown change propertychange input paste','input',function(){
			$(this).width(0);
			$(this).width($(this)[0].scrollWidth+10);
		}).on('click','.l_send_changeUserInfo',function(){
			L.dataBase.setLocalUser({
				'username' : $allDom.find('input[name="username"]').val(),
				'email' : $allDom.find('input[name="email"]').val(),
				'blog' : $allDom.find('input[name="blog"]').val()
			});
			//更新用户信息
			L.dataBase.user(function(err,user){
				if(err){
					private_userInfo = null;
				}else if(user){
					private_userInfo = user;
				}
				setUserInfoToUI.call(me,user);
				$allDom.toggleClass('flipped');
			},false);
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
			var height = text_mirror.refresh().realHeight + 20;
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
			var rest_length = me.limit - length;
			var show_txt = rest_length;
			if(rest_length < 0){
				show_txt = '<font color="#f50">' + Math.abs(rest_length) + '</font>';
			}
			$countRest.html(show_txt);
		}).on('login',function(user){
			//设置用户信息
			setUserInfoToUI.call(me,user);
			private_userInfo = user;
		}).on('sendToServiceError',function(){
			UI.prompt('网络出错，没发成功！');
		}).on('sendToServicesuccess',function(){
			$textarea.val('').trigger('change');
			UI.prompt('发布成功！');
		});
		
	}
	/**
	 * sendBox类
	 */
	function sendBox(dom,id){
		var me = this;
		var param = param || {};
		this.id = id;
		this.dom = $(sendBox_tpl)[0];
		this.limit = param.limit || 500;
		this.text = '';
		this.userDefine = {};
		$(dom).html($(this.dom));
		
		//绑定dom事件
		bindDomEvent.call(this);
		//绑定对象自定义事件
		bindCustomEvent.call(this);
		L.dataBase.user(function(err,user){
			if(err){
				private_userInfo = null;
			}else if(user){
				private_userInfo = user;
			}
			setUserInfoToUI.call(me,user);
		});
	}
	sendBox.prototype = {
		'on' : ON
	};
	
	
	
	/**
	 * 列表类
	 *
	 */
	function list(dom,id){
		this.id = id;
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
			'data' : {
				'id' : this.id
			},
			'success' : function(data){
				if(data.code && data.code == 200){
					var DATA = data.data;
					me.total = DATA.count;
					me.list.concat(DATA.list);
					
					for(var i=0,total=DATA.list.length;i<total;i++){
						DATA.list[i].time = parseTime(DATA.list[i].time,"{y}年{m}月{d}日 {h}:{ii}");
					}
					var html = me.render(DATA);
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
	exports.init = function(dom,id){
		
		this.dom = $(baseTpl)[0];
		this.id = id;
		$(dom).html($(this.dom));
		
		this.sendBox = new sendBox($(this.dom).find('.l_com_sendBox')[0],id);
		this.list = new list($(this.dom).find('.l_com_list')[0],id);
	};
});