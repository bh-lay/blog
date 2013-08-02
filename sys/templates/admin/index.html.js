//author bh-lay

var fs = require('fs');
var session= require('../../lib/session');
var temp = fs.readFileSync('./templates/admin/index.html', "utf8");


exports.render = function (req,res_this){
	var res = res_this.response;
	var session_this = session.start(req,res_this);
	var usernick = session_this.get('usernick');
		
	var txt = temp.replace('{-usernick-}',usernick)
	
	res_this.html(200,txt);
}
