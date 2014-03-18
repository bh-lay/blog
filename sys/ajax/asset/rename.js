/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');
var assetPath = "../../asset/";

exports.rename = function (req,res_this){
	var json = {
		'code':200
	}
	parse.request(req,function(err,fields,files){
		
		var root = fields.root || '';
		var oldName = fields.oldName || '';
		var newName = fields.newName || '';
		
		//消除参数中首尾的｛/｝
		root = root.replace(/^\/|\/$/g,'');
		if(err || oldName.length < 1 || newName.length < 1){
			json.code = 201;
			json.msg = '参数不全';
			json.sd = fields;
			res_this.json(json);
		}else{
			var filePath = assetPath + root + '/' + oldName;
			var newPath = '';

			var pathnameMatch = oldName.match(/(.+)\.((?:\w|\s|\d)+)$/);
			
			if(pathnameMatch){
				var extension = pathnameMatch[2];
				newPath = assetPath + root + '/' + newName + '.' + extension;
			}else{
				newPath = assetPath + root + '/' + newName;
			}
			//检测是否同名
			var exists = fs.existsSync(newPath);
			if(exists){
				json.code = 202;
				json.msg = '文件重名';
				res_this.json(json);
			}else{
				fs.rename(filePath,newPath,function(err){
					if(err){
						json.code = 201;
						json.msg = '出错了';
						json.err =[filePath,newPath]
					}
					res_this.json(json);
				});
				
			}
		}
	//	res_this.html(200,JSON.stringify(json));
	//	res_this.html(200,'<!DOCTYPE HTML><html lang="en-US"><head><meta charset="UTF-8" /></head><body>121212</body></html>');
	});
}
