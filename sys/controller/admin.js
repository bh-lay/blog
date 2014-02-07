/**
 * @author bh-lay
 * 
 */

var fs = require('fs');
var session = require('../mod/session');
var powerCode = 1;
var login_path = '/admin/login';

exports.deal = function(req,res_this,path){
	var pathname = path.pathname;
	//获取session信息
	session.start(req,res_this,function(){
		var session_this = this;
		
		if(session_this.power(powerCode)){
			//若拥有登陆后台的权限，直接登录
			var pagePath = './templates/admin/index.html';
			var controlPath = './templates/admin/index.html.js';
			require('.' + controlPath).render(req,res_this,session_this);
		}else if(pathname == login_path){
			//若为登录页面，直接登录
			fs.readFile('./templates/admin/login.html','utf-8',function(err,data){
				if(err){
					res_this.html(500,'系统出错');
				}
				res_this.html(200,data);
			});
		}else{
			//其余均跳转至登录页
			res_this.define(302,{
				'location' : login_path
			});
		}
	});
}
