/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');
var parse = require('../../core/parse.js');

exports.upload = function (req,callback){
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
				fs.unlink(files[i].path);
				newFiles.push({
 	    			'name' : 'upload.jpg',
 	    			'url' : 'http://asset.bh-lay.com/demo/upload.jpg'
 	    		});
			}
			json.files = newFiles;
		}
		callback && callback(json);
	});
}
