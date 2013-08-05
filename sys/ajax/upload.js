/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');
var parse = require('../lib/parse');

exports.render = function (req,res_this){
	
	parse.request(req,function(err,fields, files){
		
		if(files.length){
			for(var i in files){
				fs.rename(files[i].path, "../web/upload/" + files[i].name,function(err){
	    	    	if(err) throw err;
				});
			}
			
		}
		res_this.json({'hi':'ok',fields:fields,files:files});
	      
	});
}
