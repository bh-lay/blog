//author bh-lay
var fs = require('fs');
var pageTpl = fs.readFileSync('../web/admin/user/user_group.html', "utf8");
exports.render = function (req,res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(pageTpl);
	res.end();
}
