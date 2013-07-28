/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');
var post = require('../lib/post');

exports.render = function (req,res_this,res){
	
	post.parse(req,function(err,fields, files){
		
		//if(files.upload){
			for(var i in files){
				fs.rename(files[i].path, "../web/upload/" + files[i].name,function(err){
	    	    	if(err) throw err;
					
				});
			}
			res_this.json({
				'code':1,
				'msg':'received files1 !'
			});
		//}else{
			res_this.json({
				'code':2,
				'msg':'no files !'
			});
		//}
	      
	});
}
