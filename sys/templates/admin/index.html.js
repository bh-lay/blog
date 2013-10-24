//author bh-lay

var fs = require('fs');
var session= require('../../mod/session');
var temp = fs.readFileSync('./templates/admin/index.html', "utf8");


exports.render = function (req,res_this){
	var res = res_this.response;
	session.start(req,res_this,function(session_this){
		session_this.get('user_nick',function(usernick){
			session_this.get('user_id',function(userid){
				var txt = temp.replace('{-usernick-}',usernick).replace('{-userid-}',userid);
				res_this.html(200,txt);	
			});
		});
	});
}
