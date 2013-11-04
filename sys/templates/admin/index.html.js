//author bh-lay

var fs = require('fs');
var session= require('../../mod/session');
var temp = fs.readFileSync('./templates/admin/index.html', "utf8");


exports.render = function (req,res_this){
	var res = res_this.response;
	session.start(req,res_this,function(){
		var session_this = this;
		var username = session_this.get('username');
		var userid = session_this.get('user_id');
		var txt = temp.replace('{-username-}',username).replace('{-userid-}',userid);
		res_this.html(200,txt);
	});
}
