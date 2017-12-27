/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');
var utils = require('../../core/utils/index.js');
var assetPath = "../static/";

exports.createDir = function (req,callback){
	utils.parse.request(req,function(err,fields,files){
		
		var root = fields.root || '';
		var dirName = fields.name || '';
		
		//消除参数中首尾的｛/｝
		root = root.replace(/^\/|\/$/g,'');
		if(err || dirName.length < 1){
			callback && callback('参数不全');
		}else{
			var Path = assetPath + root + '/' + dirName;
			
			//检测是否同名
			var exists = fs.existsSync(Path);
			if(exists){
				callback && callback('目录重名');
			}else{
				fs.mkdir(Path, function(err){
					if(err){
						callback && callback('出错了');
					}else{
						callback && callback(null);
					}
				});
				
			}
		}
	});
}
