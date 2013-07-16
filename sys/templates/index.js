//author bh-lay
var temp = require('../tpl/page_temp');

exports.deal = function (req,res){
	var page_temp = temp.get('index',{'init':true});
	
	res.setHeader('charset','utf-8');
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	res.write(page_temp);
	res.end();
}
