/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');
var assetPath = "../../asset/";

exports.upload = function (req,res_this){
	var json = {
		'code':200,
		'files' : []
	}
	parse.request(req,function(err,fields, files){
		var errorFiles = [];
		if(err){
			code = 201
		}else if(files.length){
			var newFiles = [];
			for(var i in files){
				var newPath = assetPath  + '/' + files[i].name;
				
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
	 	    			'path' : 'http://asset.bh-lay.com/'  + '/' + files[i]['name']
	 	    		});
				}
			}
			json.files = newFiles;
		}
		res_this.json(json);
	});
}
