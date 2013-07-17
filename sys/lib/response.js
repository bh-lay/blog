/**
 * @author bh-lay
 */

var fs = require('fs');


exports.json = function(res,data){
	
	res.statusCode = 200 ;
	res.setHeader('Content-Type','application/json');
	res.setHeader('charset','utf-8');
	
	res.write(JSON.stringify(data));
	res.end();
	
}

exports.html = function(res,status,content){
	res.writeHeader(status,{
		'Content-Type' : 'text/html',
		'charset' : 'utf-8',
		'server' : 'node.js',
	});
	res.end(content);
}

exports.define = function(res,status,headers,content){
	res.writeHeader(status,headers);
	res.end(content)
}

exports.notFound = function(res,txt){
	httpStatus = 404;
	var txt=txt||'';
	res.writeHead(httpStatus, {
		'Content-Type' : 'text/html'
	});
	var temp = fs.readFileSync('./templates/404.html', "utf8");
	temp = temp.replace(/{-content-}/,txt)
	res.write(temp);
	res.end();
}
