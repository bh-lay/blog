/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');
var assetPath = "../../asset/";

exports.createDir = function (req,res_this){
	var json = {
		'code':200
	}
	parse.request(req,function(err,fields,files){
		
		var root = fields.root || '';
		var dirName = fields.name || '';
		
		//消除参数中首尾的｛/｝
		root = root.replace(/^\/|\/$/g,'');
		if(err || dirName.length < 1){
			json.code = 201;
			json.msg = '参数不全';
			res_this.json(json);
		}else{
			var Path = assetPath + root + '/' + dirName;
			
			//检测是否同名
			var exists = fs.existsSync(Path);
			if(exists){
				json.code = 202;
				json.msg = '目录重名';
				res_this.json(json);
			}else{
				fs.mkdir(Path,777,function(err){
					if(err){
						json.code = 201;
						json.msg = '出错了';
					}
					res_this.json(json);
				});
				
			}
		}
	});
}
