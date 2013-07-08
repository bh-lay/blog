//author bh-lay

var fs = require('fs');
var tpl = fs.readFileSync('./templates/admin/user/power.html', "utf8");

exports.render = function (req,res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(tpl);
	res.end();
}
