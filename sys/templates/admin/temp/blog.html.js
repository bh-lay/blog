//author bh-lay

var fs = require('fs');
var tempSrc = './templates/index.html';

exports.render = function (req,res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	var tpl = fs.readFileSync('./templates/admin/temp/blog.html', "utf8");
	
	
	var tempCode = fs.readFileSync(tempSrc, "utf8");
		
	tpl = tpl.replace(/{-content-}/,tempCode);
	
	res.write(tpl);
	res.end();
}
