//author bh-lay
var fs = require('fs');
var tpl = require('./tpl/module_tpl');
var temp = fs.readFileSync('./tpl/index.html', "utf8");

exports.deal = function (req,res){
	res.setHeader('charset','utf-8');
	res.writeHead(200, {'Content-Type': 'text/html'});
	page = tpl.init(temp);
	res.write(page);
	res.end();
}
