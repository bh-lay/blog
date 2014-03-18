/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');
var assetPath = "../../asset/";

exports.upload = function (req,res_this){
	var json = {
		'code':200,
		'fields' : [],
		'files' : []
	}
	parse.request(req,function(err,fields, files){
		var errorFiles = [];
		var ROOT = fields.root || '';
		//消除参数中首尾的｛/｝
		ROOT = ROOT.replace(/^\/|\/$/g,'');
		if(err){
			code = 201
		}else if(files.length){
			json.fields = fields;
			var newFiles = [];
			for(var i in files){
				var newPath = assetPath + ROOT + '/' + files[i].name;
				
				//禁止上传同名文件
				var exists = fs.existsSync(newPath);
				if(exists){
					errorFiles.push({
						'name' : files[i]['name']
					});
				}else{
					fs.rename(files[i].path,newPath);
					newFiles.push({
	 	    			'name' : files[i]['name'],
	 	    			'path' : 'http://asset.bh-lay.com/' + ROOT + '/' + files[i]['name']
	 	    		});
				}
			}
			json.files = newFiles;
			if(errorFiles.length > 0){
				json.code = 203;
				json.fail = errorFiles;
			}
		}
		res_this.json(json);
	//	res_this.html(200,JSON.stringify(json));
	//	res_this.html(200,'<!DOCTYPE HTML><html lang="en-US"><head><meta charset="UTF-8" /></head><body>121212</body></html>');
	});
}
