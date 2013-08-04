/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');
var post = require('../lib/post');

exports.render = function (req,res_this){
	
	post.parse(req,function(err,fields, files){
		
		if(files.length){
			for(var i in files){
				fs.rename(files[i].path, "../web/upload/" + files[i].name,function(err){
	    	    	if(err) throw err;
					
				});
			}
			
		}
		res_this.json({fields:fields,files:files});
	      
	});
}
