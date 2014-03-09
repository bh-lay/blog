//author bh-lay

var fs = require('fs');
var session= require('../../mod/session');


exports.render = function (req,res_this){
var temp = fs.readFileSync('./templates/admin/index.html', "utf8");
	var res = res_this.response;
	session.start(req,res_this,function(){
		var session_this = this;
		var username = session_this.get('username');
		var userid = session_this.get('user_id');
		
		var data = {
			'username' : username,
			'userid' : userid
		};
		data.database = JSON.stringify(data);
		var txt = temp.replace(/{(\w+)}/g,function(a,b){
			return data[b] || '';
		});
		res_this.html(200,txt);
	});
};
