/**
 * @author bh-lay
 */

var fs = require('fs');


/*read static resources*/
function readFile(staticFileRoot,mime,path,req,responseFile,notFound) {
	//匹配文件扩展名
	var pathname_split = path.match(/.\.([^.]+)$/);
	var ext = pathname_split ? pathname_split[1] : null;
	
    var realPath;
	//add a default files for directory
	if(ext == null) {
		ext = 'html';
		realPath = staticFileRoot + path + '/index.html'
	}else{
        realPath = staticFileRoot + path;
    }
	var content_type = mime[ext]||'unknown';
  
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
				},'ext:' + ext + ',realPath:' + realPath);
				
				return
			}
			fs.stat(realPath, function(err, stat) {
				if(err) {
					/**
					 * 500 server error 
					 */
					responseFile(500,{
						'Content-Type' : 'text/plain'
					},'ext:' + ext + ',realPath:' + realPath);
					
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