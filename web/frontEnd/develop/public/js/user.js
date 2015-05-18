/**
 * 全局登录方法
 *   需要污染一个命名空间：appLoginCallback
 * 公用数据中心
 *   L.dataBase.user(fn);
 *		err :是否获取到用户信息
 *		info:用户信息
 *		type：用户类型（online、local）
 */

define(function(require,exports){
    var hex_md5 = require('public/js/md5');
    
    var loginPanel_tpl = ['<div class="l_loginPanel">',
		'<div class="l_loginPanel_tabs">',
			'<a href="#" data-type="github"><i class="layIcon">A</i>github</a>',
			'<a href="#" data-type="sina">微博</a>',
			'<a href="#" data-type="account">帐号</a>',
			'<a href="#" data-type="define">游客</a>',
		'</div>',
		'<div class="l_loginPanel_cnts">',
			'<div class="l_loginPanel_item">',
				'<div class="l_loginPanel_github">',
					'使用github帐号登录',
				'</div>',
			'</div>',
			'<div class="l_loginPanel_item">',
				'<div class="l_loginPanel_sina">',
					'新浪微博登录尚未开发',
				'</div>',
			'</div>',
			'<div class="l_loginPanel_item">',
				'<div class="l_loginPanel_account">',
					'<input name="email" type="text" placeholder="邮箱"/>',
					'<input name="password" type="password" placeholder="密码"/>',
					'<input type="button" value="登录" data-type="account" />',
				'</div>',
			'</div>',
			'<div class="l_loginPanel_item">',
				'<div class="l_loginPanel_define">',
					'<input name="nickname" type="text" placeholder="昵称" />',
					'<input name="website" type="text" placeholder="个人主页" />',
					'<input type="button" value="确定"  data-type="define" />',
				'</div>',
			'</div>',
		'</div>',
		'<div class="l_loginPanel_arrow">◆</div>',
	'</div>'].join('');
	
	//存储当前用户的信息
	var userInfo = null;
	//存储程序需要用到的登录回调
	var LoginCallbacks = [];
	
	//相应登录的回调函数
	window.appLoginCallback = function(data){
		for(var i=0,total=LoginCallbacks.length;i<total;i++){
			LoginCallbacks[i](data);
		}
		LoginCallbacks = [];
	};
	
	function getMyInfo(callback){
		$.ajax({
			'url' : '/ajax/user/detail',
			'type' : 'POST',
			'success' : function(data){
				if(data && data.code == 200){
					callback && callback(null,data.detail);
				}else{
					callback && callback('error');
				}
			}
		});
	}
	function LOGIN(param,callback){
		param = param || {};
        var me = this;
		
		var pop = UI.pop({
			'width' : 400,
			'html' : loginPanel_tpl,
			'mask' : false,
			'closeFn' : param.closeFn
		});
		var $popDom = $(pop.dom);
		this.loginFn = callback;
		this.$arrow = $popDom.find('.l_loginPanel_arrow');
		this.$cnts_item = $popDom.find('.l_loginPanel_item');
		
		$popDom.on('click','.l_loginPanel_tabs a',function(){
			var type = $(this).attr('data-type');
			me.tab(type);
		}).on('click','input[data-type="account"]',function(){
			var email = $popDom.find('input[name="email"]').val();
			var password = $popDom.find('input[name="password"]').val();
			$.ajax({
				'url' : '/ajax/user/login',
				'type' : 'POST',
				'data' : {
					'email' : email,
					'password' : password
				},
				'success' : function(data){
					if(data && data.code == 200){
						pop.close();
					}
					me.loginFn && me.loginFn(data);
					
				}
			})
		}).on('click','input[data-type="define"]',function(){
			me.loginFn && me.loginFn({
				'code' : 200,
				'user' : {
					'nickname' : $popDom.find('input[name="nickname"]').val(),
					'website' : $popDom.find('input[name="website"]').val()
				}
			});
			pop.close();
		});
		//登录
		this.tab('define');
	}
	LOGIN.prototype.tab = function(type){
		var index,
			me = this;
		switch(type){
			case 'github':
				index = 0;
				LoginCallbacks.push(this.loginFn);
				window.open('https://github.com/login/oauth/authorize?client_id=150e88277697b41e0702&redirect_uri=http://bh-lay.com/snsLogin/github/');
			break
			case 'sina':
				index = 1;
			break
			case 'define':
				index = 3;
			break
			//account
			default:
				index = 2;
		}
		this.$arrow.css('top',index*40);
		this.$cnts_item.not(this.$cnts_item.eq(index)).animate({
			'left' : '-100%'
		},100,function(){
			me.$cnts_item.eq(index).css({
				'left' : 0,
				'display' : 'none'
			}).fadeIn(200);
		});
	};
    
    
	exports.login = function (param,callback){
		return new LOGIN(param,callback);
	};
	exports.setLocalUser = function(data){
		var data_str = JSON.stringify({
			'username' : data.username,
			'email' : data.email,
			'blog' : data.blog
		});
		localStorage.setItem("userInfo",data_str);
	};
	exports.info = function(callback,useCacheFlag){
		var useCache = typeof(useCacheFlag) == 'boolean' ? useCacheFlag : true;
		//是否已有用户信息缓存
		if(useCache && userInfo){
			callback && callback(null,userInfo);
		}else{
			//向服务器请求用户信息
			getMyInfo(function(err,user){
				if(!err){
					//优先级一：已登陆
					userInfo = user;
					callback && callback(err,user,'online');
				}else{
					//优先级二：本地缓存
					var user = localStorage.getItem("userInfo");
					if(user){
						userInfo = JSON.parse(user);
						//增加gravatar头像(md5邮箱)
						if(userInfo.email.length){
							userInfo.avatar = 'http://www.gravatar.com/avatar/' + hex_md5(userInfo.email);
						}
						callback && callback(null,userInfo,'local');
					}else{
						callback && callback('未登录');
					}
				}
			});
		}
	};
});