/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');
var utils = require('../../core/utils/index.js');
var assetPath = "../static/";

exports.rename = function (req,callback){
	utils.parse.request(req,function(err,fields,files){
		
		var pathname = fields.pathname || '';
		var newName = fields.newName || '';
		
		//消除参数中首尾的｛/｝
		pathname = pathname.replace(/^\/|\/$/g,'');
		if(err || pathname.length < 1 || newName.length < 1){
			callback && callback('参数不全');
		}else{
			var filePath = assetPath + '/' + pathname;
			var newPath = '';
			
			/**
			 * (.*)所在目录
			 * (.+)文件名
			 * ((?:\w|\s|\d)+)后缀名
			 */
			var pathnameMatch = pathname.match(/(.*)\/(.+)\.((?:\w|\s|\d)+)$/);
			
			if(pathnameMatch){
				var extension = pathnameMatch[3];
				var root = pathnameMatch[1];
				newPath = assetPath + root + '/' + newName + '.' + extension;
			}else{
				var pathnameMatch2 = pathname.match(/(.*)\/(.+)$/);
				if(pathnameMatch2){
					newPath = assetPath + pathnameMatch2[1] + '/' + newName;
				}else{
					newPath = assetPath + '/' + newName;
				}
			}
			//检测是否同名
			var exists = fs.existsSync(newPath);
			if(exists){
				callback && callback('文件重名');
			}else{
				fs.rename(filePath,newPath,function(err){
					if(err){
						callback && callback('出错了');
					}else{
						callback && callback(null);
					}
				});
				
			}
		}
	//	res_this.html(200,JSON.stringify(json));
	//	res_this.html(200,'<!DOCTYPE HTML><html lang="en-US"><head><meta charset="UTF-8" /></head><body>121212</body></html>');
	});
}
