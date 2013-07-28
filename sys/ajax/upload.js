/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');
var post = require('../lib/post');

exports.render = function (req,res_this,res){
	
	post.parse(req,function(err,fields, files){

		if(files.upload){
			fs.rename(files.upload.path, "../web/upload/" + files.upload.name,function(err){
    	    	if(err) throw err;
				res_this.json({
					'code':1,
					'msg':'received files1 !'
				});
			});
		}else{
			res_this.json({
				'code':2,
				'msg':'no files !'
			});
		}
	      
	});
}
