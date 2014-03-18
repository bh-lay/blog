/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');
var assetPath = "../../asset/";

exports.del = function (req,res_this){
	var json = {
		'code' : 200,
		'msg' : '删除成功'
	}
	parse.request(req,function(err,fields, files){
		var errorFiles = [];
		var path = fields.path || '';
		//消除参数中首尾的｛/｝
		path = path.replace(/^\/|\/$/g,'');
		if(err || path.length < 1){
			code = 201;
			msg = '参数不完整';
			res_this.json(json);
		}else{
			var Path = assetPath + path;
			fs.unlink(Path,function(err,data){
				if(err){
					json.code = 202;
				}
				json.extra = data;
				res_this.json(json);
			});
		}
	//	res_this.html(200,JSON.stringify(json));
	//	res_this.html(200,'<!DOCTYPE HTML><html lang="en-US"><head><meta charset="UTF-8" /></head><body>121212</body></html>');
	});
}
