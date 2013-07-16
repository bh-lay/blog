//author bh-lay
var temp = require('../tpl/page_temp');

exports.deal = function (req,res){
	res.setHeader('charset','utf-8');
	res.writeHead(200, {'Content-Type': 'text/html'});
	page = temp.get('index',{'init':true});
	res.write(page);
	res.end();
}
