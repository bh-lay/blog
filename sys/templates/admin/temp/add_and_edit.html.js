//author bh-lay

var fs = require('fs');
var querystring = require('querystring');

var temp_list = require('../../../conf/templates');

exports.render = function (req,res_this){
	
	var dataString = req.url.split('?')[1]||'',
		data = querystring.parse(dataString);
	
	var tempName = data['temp']||'';
	
	if(!temp_list[tempName]){
		
		res_this.html(200,'无此模版');

	}else{
	
		var tpl = fs.readFileSync('./templates/admin/temp/add_and_edit.html', "utf8");
	
		var tempCode = fs.readFileSync(temp_list[tempName]['src'], "utf8");
		
		tpl = tpl.replace(/{-tempName-}/,tempName).replace(/{-content-}/,tempCode);
		
		res_this.html(200,tpl);
	}
}
