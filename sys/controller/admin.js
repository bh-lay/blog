/*
 * author bh-lay
 */

var fs = require('fs');
var session = require('../mod/session');
var powerCode = 1;
var login_path = '/admin/login.html';

exports.deal = function(req,res_this,path){
	var pathname = path.pathname;
	if(!path.filename) {
		pathname += '/index.html'
	}
	session.start(req,res_this,function(session_this){
		
		console.log(session_this.power(powerCode),session_this,'----------------------');
		if(session_this.power(powerCode) || pathname == login_path){
			var pagePath = './templates' + pathname;
			var controlPath = './templates' + pathname + '.js';
	
			fs.exists(controlPath, function (exists) {
				if(exists){
					require('.' + controlPath).render(req,res_this,session_this);
				}else{
					fs.exists(pagePath, function (exists) {
						if (exists) {
							var page = fs.readFileSync(pagePath, "utf8");
							res_this.html(200,page);
						}else{
							res_this.notFound('通知管理员，系统出错！');
						}
					});
				}
			});
		}else{
			//FIXME http code// need login first
			res_this.define(302,{
				'location' : login_path
			});
		}
	});
}
