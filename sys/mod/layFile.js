/**
 * @author bh-lay
 */

var fs = require('fs');

/*Mime-Type*/
var mime = {
	'html' : 'text/html',
	'js' : 'application/x-javascript',
	'css' : 'text/css',
	'ico' : 'image/x-icon',
	'jpg' : 'image/jpeg',
	'png' : 'image/png',
	'gif' : 'image/gif',
	'rar' : 'application/zip',
	'zip' : 'application/zip',
	'pdf' : 'application/pdf',
};

//404 not found
function notFound(ext,res_this){
	if(ext.match(/^(png|gif|jpg)$/)){
		res_this.define(404,{
			'Content-Type' : 'text/plain'
		},'this image is not found !');
	}else if(ext.match(/^html$/)){
		res_this.notFound();
	}else{
		res_this.define(404,{
			'Content-Type' : 'text/plain'
		},'this image is not found !');
	}
}

/*read static resources*/
function readFile(req , res_this) {
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
		res_this.define(415,{
			'Content-Type' : 'text/plain'
		},'this type file(*.'+ext+') is not supposted !');
		
		return
	}
	fs.exists(realPath, function(exists) {
		if(!exists){
			notFound(ext,res_this)
			return ;
		}
		
		fs.readFile(realPath, function(err, file) {
			if(err) {
				/**
				 * 500 server error 
				 */
				res_this.define(500,{
					'Content-Type' : 'text/plain'
				},err.toString());
				
				return
			} 
			
			fs.stat(realPath, function(err, stat) {
				
				var lastModified = stat.mtime.toUTCString();
				
				if(req.headers['if-modified-since'] && (lastModified == req.headers['if-modified-since'])) {
					
					res_this.define(304,"Not Modified");
					
				} else {
					var maxAge = 60 * 60 * 24 * 365;
					var expires = new Date();
					expires.setTime(expires.getTime() + maxAge * 1000);
					res_this.define(200,{
						"Content-Type" : mime[ext],
						"Expires" : expires.toUTCString() ,
						"Cache-Control" : "max-age=" + maxAge ,
						"Last-Modified" : lastModified,
						"Server" : "node.js",
					},file);
					
				}
			});
		});
	});
}

exports.read = readFile;