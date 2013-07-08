//author bh-lay

var fs = require('fs');
var session= require('../../sys/conf/session');
var temp = fs.readFileSync('../web/admin/index.html', "utf8");
var pageData = {
	
};

exports.render = function (req,res){
	var session_this = session.start(req,res);
	var usernick = session_this.get('usernick');
	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	var txt = temp.replace('{-usernick-}',usernick)
	res.write(txt);
	res.end();
}
