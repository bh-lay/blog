/*
 * author bh-lay
 */

var fs = require('fs');
var layFile= require('./conf/layFile');
var session= require('./conf/session');
var powerCode = 1;

exports.deal=function(req,res,pathname){
	if(pathname.split('.').length==1) {
		pathname += '/index.html'
	}
	
	if(pathname.match(/.html.js$/)){
		res.end('forbidden');
	}else if(pathname.match(/.html$/)){
		var session_this = session.start(req,res);
			
		if(session_this.power(powerCode)){
			var controlPath='../web/'+pathname+'.js';
			fs.exists(controlPath, function (exists) {
				if (!exists) {
					layFile.read(req,res);
				}else{
					var ctl = require(controlPath);
					ctl.render(req,res);
				}
			});			
		}else{
			//need login first
			var page = fs.readFileSync('../web/admin/login.html', "utf8");
			res.writeHead(200, {'Content-Type' : 'text/html'});
			res.write(page);
			res.end();
		}
	}else{
		layFile.read(req,res);
	}
}
