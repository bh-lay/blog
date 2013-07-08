//author bh-lay
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
};

var httpStatus = null;

/*
 * 404 notFound
 */
function notFound(res,txt){
	httpStatus = 404;
	var txt=txt||'';
	res.writeHead(httpStatus, {
		'Content-Type' : 'text/html'
	});
	var temp = fs.readFileSync('./tpl/404.html', "utf8");
	temp=temp.replace(/{-content-}/,txt)
	res.write(temp);
	res.end();
}

/**
 * 415 not supposted 
 */
function notSuppost(res,ext){
	httpStatus = 415 ;
	res.writeHead(httpStatus, {'Content-Type' : "text/plain"});
	res.end('this type file(*.'+ext+') is not supposted !');
}

/**
 * 500 server error 
 */
function serverErr(res,err){
	httpStatus = 500;
	res.writeHead(httpStatus, {
		'Content-Type' : 'text/plain'
	});
	res.end(err.toString());
}

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
		notSuppost(res,ext);
		return
	}
	fs.exists(realPath, function(exists) {
		if(exists){
			fs.readFile(realPath, function(err, file) {
				if(err) {
					serverErr(res,err)
				} else {
					var maxAge = 60 * 60 * 24 * 365;
					var expires = new Date();
					expires.setTime(expires.getTime() + maxAge * 1000);
					
					res.setHeader("Expires", expires.toUTCString());
					res.setHeader("Cache-Control", "max-age=" + maxAge);
					res.setHeader("Server", "node.js");
					
					fs.stat(realPath, function(err, stat) {
						var lastModified = stat.mtime.toUTCString();
						res.setHeader("Last-Modified", lastModified);
						if(req.headers['if-modified-since'] && lastModified == req.headers['if-modified-since']) {
							httpStatus = 304 ;
							res.writeHead(httpStatus, "Not Modified");
							res.end();
						} else {
							httpStatus = 200 ;
							res.writeHead(httpStatus, {
								'Content-Type' : mime[ext] || "text/plain"
							});
							res.end(file);
						}
					});
				}
			});
		}else{
			// 404 notFound
			notFound(res);
		}
	});
}

exports.notFound=notFound;
exports.read = readFile;