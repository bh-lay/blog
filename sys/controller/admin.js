/**
 * @author bh-lay
 * 
 */

var session = require('../mod/session');
var powerCode = 1;
var login_path = '/admin/login';
var views = require('../mod/views');

exports.deal = function(req,res_this,path){
	var pathname = path.pathname;
	//获取session信息
	session.start(req,res_this,function(){
		var session_this = this;
		
		if(session_this.power(powerCode)){
			//若拥有登陆后台的权限，直接登录
			
			//获取后台视图
			views.get('admin/index',{
				'title' : '小剧客栈_后台管理',
				'keywords' : '剧中人,bh-lay,网站建设,网页设计,设计师',
				'description' : '小剧客栈是剧中人精心营造的一个向广大设计爱好者、喜欢剧中人开放的博客，小剧希望用设计师鞭策自己，愿意和你共同分享，一起进步！',
				'username' : session_this.get('username'),
				'userid' : session_this.get('user_id')
			},function(err,html){
				if(err){
					res_this.html(500,'系统出错');
					return
				}
				res_this.html(200,html);
			});
		}else if(pathname == login_path){
			//若为登录页面，直接登录
			
			//获取后台视图
			views.get('admin/login',{},function(err,html){
				if(err){
					res_this.html(500,'系统出错');
					return
				}
				res_this.html(200,html);
			});
		}else{
			//其余均跳转至登录页
			res_this.define(302,{
				'location' : login_path
			});
		}
	});
}
