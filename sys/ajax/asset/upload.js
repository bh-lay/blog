/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');

exports.upload = function (req,res_this){
	var json = {
		'code':200,
		'fields' : [],
		'files' : []
	}
	parse.request(req,function(err,fields, files){
		var errorFiles = [];
		if(files.length){
			json.files = files;
			for(var i in files){
				fs.rename(files[i].path, "../web/upload/" + files[i].name,function(err){
	    	    	if(err){
	    	    		errorFiles.push(files[i]);
	    	    	};
				});
			}
			if(errorFiles.length > 0){
				json.code = 203;
				json.fail = errorFiles;
			}
		}
		res_this.json(json);
	      
	});
}
