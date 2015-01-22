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
	'txt' : 'text/plain'
};

/*read static resources*/
function readFile(realPath,req,responseFile,notFound) {
	//匹配文件扩展名
	var pathname_split = realPath.match(/.\.([^.]+)$/);
	var ext = pathname_split ? pathname_split[1] : null;
	
	console.log(pathname_split,ext,2);
	//add a default files for directory
	if(ext == null) {
		ext = 'html';
		realPath += '/index.html'
	}
	var content_type = mime[ext]||'unknown';
//	if(!mime[ext]){
		/**
		 * 415 not supposted 
		 */
//		responseFile(415,{
//			'Content-Type' : 'text/plain'
//		},'this type file(*.'+ext+') is not supposted !');
		
//		return
//	}
	fs.exists(realPath, function(exists) {
		if(!exists){
			notFound();
			return ;
		}
		fs.readFile(realPath, function(err, file) {
			if(err) {
				/**
				 * 500 server error 
				 */
				responseFile(500,{
					'Content-Type' : 'text/plain'
				},err.toString());
				
				return
			}
			fs.stat(realPath, function(err, stat) {
				if(err) {
					/**
					 * 500 server error 
					 */
					responseFile(500,{
						'Content-Type' : 'text/plain'
					},err.toString());
					
					return
				}
				var lastModified = stat.mtime.toUTCString();
				
				if(req.headers['if-modified-since'] && (lastModified == req.headers['if-modified-since'])) {
					
					responseFile(304);
					
				} else {
					var maxAge = 60 * 60 * 24 * 365;
					var expires = new Date();
					expires.setTime(expires.getTime() + maxAge * 1000);
					responseFile(200,{
						"Content-Type" : content_type,
						"Expires" : expires.toUTCString() ,
						"Cache-Control" : "max-age=" + maxAge ,
						"Last-Modified" : lastModified,
					},file);
					
				}
			});
		});
	});
}

exports.read = readFile;