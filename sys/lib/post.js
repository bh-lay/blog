/**
 * @author bh-lay
 */
/*
	callBack(err, fields, files);
	
	err[201]  'please use [post] to submit'
  
 */

var querystring = require('querystring');
var formidable = require('formidable');

exports.parse = function(req,callBack){
	if(!callBack){
		return 
	}
	if (req.method != 'POST' ){
		//@FIXME response error
		callBack({'201' : 'please use [post] to submit'},null);
		return;
	}
	var content_type = req['headers']['content-type'];
	
	if(!content_type.match(/multipart/)){
		var postString = '';
		req.addListener('data', function(chunk){
			
			postString += chunk;
			
		}).addListener('end', function(){
			
			var fields = querystring.parse(postString);
			callBack(null,fields);
			
		});
	}else{
		var form = new formidable.IncomingForm();
		form.uploadDir = "./temporary";
		form.maxFieldsSiz = 1024 ;
		
		form.parse(req, function(error, fields, files) {
			
			callBack(error,fields, files);
			
		});
	}
}
