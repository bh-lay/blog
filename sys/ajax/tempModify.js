/**
 * @author bh-lay
 * 
 */
/**
 @Demo 
 
	$.ajax({
		'type':'POST',
		'url':'/ajax/tempModify',
		'data':{
			'module' : 'index',
			'text' : '......'
		},
	});
 */ 

var fs = require('fs');
var parse = require('../lib/parse');

var temp_list = require('../conf/templates');

exports.render = function (req,res_this){
	if (req.method != 'POST'){
		res_this.json({
			'code' : 2,
			'msg' : 'please use [post] instead [get] to submit'
		});
		return ;
	}
	
	parse.request(req,function(err,data){

		var data = data;
		var module = data['module']||'';
		var text = data['text'];
		
		var tempSrc = temp_list[module] ? temp_list[module]['src'] : null;
		
		if(tempSrc){
			fs.writeFile(tempSrc,text,function(err){
				if(err) throw err;
				res_this.json({
					'code':1,
					'msg':'modified success !'
				});
			});
		}else{
			res_this.json({
				'code':2,
				'msg':'modified fail !'
			});
		}

	});
}
