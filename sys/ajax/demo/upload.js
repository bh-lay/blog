/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');
var utils = require('../../core/utils/index.js');

exports.upload = function (req,callback){
	var json = {
		'code':200,
		'files' : []
	}
	utils.parse.request(req,function(err,fields, files){
		var errorFiles = [];
		if(err){
			code = 201
		}else if(files.length){
			var newFiles = [];
			for(var i in files){
				fs.unlink(files[i].path);
				newFiles.push({
 	    			'name' : 'upload.jpg',
 	    			'url' : 'http://static.bh-lay.com/demo/upload.jpg'
 	    		});
			}
			json.files = newFiles;
		}
		callback && callback(json);
	});
}
