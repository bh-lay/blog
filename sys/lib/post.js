/**
 * @author bh-lay
 */

var querystring = require('querystring');
var formidable = require('formidable');

exports.parse = function(req,callBack){
	if(!callBack){
		return 
	}
	if (req.method != 'POST' ){
		//@FIXME response error
		callBack('method is not POST',null);
		return;
	}
	var content_type = req['headers']['content-type'];
	
	if(!content_type.match(/multipart/)){
		var postString = '';
		req.addListener('data', function(chunk){
			postString += chunk;
		}).addListener('end', function(){
			var data = querystring.parse(postString);
			callBack(null,data);
		});
	}else{
		var form = new formidable.IncomingForm();
		form.uploadDir = "./temporary";
		
		form.parse(req, function(error, fields, files) {
			
			callBack(error,fields, files);
			
		});
	}
}
