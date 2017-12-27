/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');
var utils = require('../../core/utils/index.js');
var assetPath = "../static/";

exports.upload = function (req,callback){
	utils.parse.request(req,function(err,fields, files){
		var errorFiles = [];
		if(err){
			callback && callback(err);
		}else if(files.length){
			var newFiles = [];
			var root = (fields.root || '/');
			//消除参数中首尾的｛/｝
			root = root.replace(/^\/|\/$/g,'');
			
			
			for(var i in files){
				var newPath = assetPath  + '/' + root + '/' + files[i].name;
				
				//禁止上传同名文件
				var exists = fs.existsSync(newPath);
				if(exists){
					errorFiles.push({
						'name' : files[i]['name']
					});
				}else{
					fs.rename(files[i].path,newPath);
					newFiles.push({
						'name' : files[i]['name']
	 				});
				}
			}
			callback && callback(null,newFiles);
		}
	});
}
