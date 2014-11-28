/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');
var parse = require('../../core/parse.js');
var assetPath = "../../asset/";

exports.file = function (req,callback){
	var json = {
		'code' : 200,
		'msg' : '删除成功'
	}
	parse.request(req,function(err,fields, files){
		var errorFiles = [];
		var path = fields.path || '';
		//消除参数中首尾的｛/｝
		path = path.replace(/^\/|\/$/g,'');
		if(err || path.length == 1){
			callback && callback('参数不完整');
		}else{
			var Path = assetPath + path;
			fs.unlink(Path,function(err,data){
				if(err){
					callback && callback(err);
				}else{
					callback && callback(null);
				}
			});
		}
	});
};