/*
 * author bh-lay
 */

var fs = require('fs');
var layFile = require('./lib/layFile');
var session = require('./lib/session');
var powerCode = 1;

exports.deal=function(req,res,res_this,pathname){
	
	if(pathname.split('.').length==1) {
		pathname += '/index.html'
	}
	
	if(pathname.match(/.html.js$/)){
	
		res_this.define(415,{
			'Content-Type' : 'text/plain'
		},'this type file is not supposted !');
	
	}else if(pathname.match(/.html$/)){
		var session_this = session.start(req,res);
			
		if(session_this.power(powerCode)){
			var controlPath='./templates/'+pathname+'.js';
			fs.exists(controlPath, function (exists) {
				if (!exists) {
					layFile.read(req,res);
				}else{
					require(controlPath).render(req,res);
				}
			});			
		}else{
			//need login first
			var page = fs.readFileSync('./templates/admin/login.html', "utf8");
			
			res_this.define(200,{
				'Content-Type' : 'text/html'
			},page);

		}
	}else{
		layFile.read(req,res);
	}
}
