/*
 * author bh-lay
 */

var fs = require('fs');
var session = require('../mod/session');
var powerCode = 1;

exports.deal = function(req,res_this,path){
	var pathname = path.pathname;
	if(!path.filename) {
		pathname += '/index.html'
	}
	if(pathname.match(/.html$/)){
		var session_this = session.start(req,res_this);
			
		if(session_this.power(powerCode)){
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
							res_this.notFound();
						}
					});
				}
			});
		}else{
			//need login first
			var page = fs.readFileSync('./templates/admin/login.html', "utf8");
			
			res_this.html(200,page);

		}
	}else{
		res_this.notFound('this type file is not supposted !');
	}
}
