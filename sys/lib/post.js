/**
 * @author bh-lay
 * 
 * 	callBack(err, fields, files);
 * 
 */

var querystring = require('querystring');
var formidable = require('formidable');

exports.parse = function(req,callBack){
	if(!callBack){
		return 
	}

	var method = req['method']||'';
	
	if(method == 'POST' || method =='post'){
		var form = new formidable.IncomingForm();
		form.uploadDir = "./temporary";
		//form.keepExtensions = true;
		
		form.parse(req, function(error, fields, files) {
			// @FIXME when i upload more than one file ,the arguments files is only single file
			// but i can get all files information form form.openedFiles
			// it confused me
			//console.log(1234,arguments);
			
			files = form.openedFiles;
			
			callBack(error,fields, files);
		
		});
	}else{
		var fields = querystring.parse(req.url.split('?')[1]);
		callBack(null,fields,[]);
	}
}
