/*
 * author bh-lay
 * demo 
 */

var querystring = require('querystring');
var fs = require('fs');

var temp_list = require('../conf/templates');

exports.render = function (req,res_this,res){
	if (req.method != 'POST'){
		res_this.json({
			'code' : 2,
			'msg' : 'please use [post] instead [get] to submit'
		});
		return ;
	}
	
	var info='';
	req.addListener('data', function(chunk){
		info += chunk; 
	}).addListener('end', function(){
		var data = querystring.parse(info);
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
