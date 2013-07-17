/*
 * author bh-lay
 * demo 
 */

var querystring = require('querystring');
var response = require('../lib/response');
var fs = require('fs');

var tempSrc = './templates/index.html';

exports.render = function (req,res){
	if (req.method != 'POST'){
		response.json(res,{
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
		var parm={
			'module' : data['module']||'',
			'text' : data['text'],
		};
		
		fs.writeFile(tempSrc,parm.text,function(err){
			if(err) throw err;

			res.end('ok')

		});
		
	//	response.json(res,{
	//		'code':2,
	//		'msg':'please insert complete code !'
	//	});
	});
}
