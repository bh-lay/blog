/**
 * @author bh-lay
 */

var fs = require('fs');
var response = require('./response');

/*Mime-Type*/
var mime = {
	'html' : 'text/html',
	'js' : 'application/x-javascript',
	'css' : 'text/css',
	'ico' : 'image/x-icon',
	'jpg' : 'image/jpeg',
	'png' : 'image/png',
	'gif' : 'image/gif',
};


/*read static resources*/
function readFile(req, res) {
	var pathname = req.url.split('?')[0];
	var realPath = '.././web/' + pathname;
	var ext = pathname.split('.')[1];
	
	//add a default files for directory
	if(!ext) {
		ext = 'html';
		realPath += '/index.html'
	}
	if(!mime[ext]){
		/**
		 * 415 not supposted 
		 */
		response.define(res,415,{
			'Content-Type' : 'text/plain'
		},'this type file(*.'+ext+') is not supposted12345 !');
		
		return
	}
	fs.exists(realPath, function(exists) {
		if(exists){
			fs.readFile(realPath, function(err, file) {
				if(err) {
					/**
					 * 500 server error 
					 */
					response.define(res,500,{
						'Content-Type' : 'text/plain'
					},err.toString());

				} else {
									
					fs.stat(realPath, function(err, stat) {
						
						var lastModified = stat.mtime.toUTCString();
						
						if(req.headers['if-modified-since'] && (lastModified == req.headers['if-modified-since'])) {
							
							response.define(res,304,"Not Modified");
							
						} else {
							var maxAge = 60 * 60 * 24 * 365;
							var expires = new Date();
							expires.setTime(expires.getTime() + maxAge * 1000);
							response.define(res,200,{
								"Expires" : expires.toUTCString() ,
								"Cache-Control" : "max-age=" + maxAge ,
								"Last-Modified" : lastModified,
								"Server" : "node.js",
							},file);
							
						}
					});
				}
			});
		}else{
			// 404 notFound
			response.notFound(res);
		}
	});
}

exports.read = readFile;