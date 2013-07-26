/**
 * @author bh-lay
 */
/*
	@DEMO
	var response = require('./response');
	var res_this = response.start(req,res);
	
	res_this.json({code:1,msg:'msg text !'});
	res_this.html(200,'html text');
	res_this.define(200,{content-type:'text/html'},'<html></html>');
	res_this.notFound('not found');
	res_this.error('error');
	 
*/

var fs = require('fs');

function logger(req,status){
	var logger={
		'time':new Date(),
		'ip':req['connection']['remoteAddress'],
		'url':req.url,
		'user-agent':req.headers['user-agent'],
		'status' : status
	};
	console.log(logger);
}

function json(req,res){
	var req = req,
		res = res;
	return function(data){
		res.status = 200 ;
		res.setHeader('Content-Type','application/json');
		res.setHeader('charset','utf-8');
		
		res.write(JSON.stringify(data));
		res.end();
		
		logger(req,200);
	}
	
}

function html(req,res){
	var req = req,
		res = res;
	return function(status,content){
		res.writeHeader(status,{
			'Content-Type' : 'text/html',
			'charset' : 'utf-8',
			'server' : 'node.js',
		});
		res.end(content);
		
		logger(req,status);
	}
}

function define(req,res){
	var req = req,
		res = res;
	return function(status,headers,content){
		res.writeHeader(status,headers);
		
		content = content || null;
		
		res.end(content);
		
		logger(req,status);
	}
}


function notFound(req,res){
	var req = req,
		res = res;
	return function(txt){
		var txt=txt||'';
		res.writeHead(404, {
			'Content-Type' : 'text/html'
		});
		var temp = fs.readFileSync('./templates/404.html', "utf8");
		temp = temp.replace(/{-content-}/,txt)
		res.write(temp);
		res.end();
		
		logger(req,404);
	}
}

function error(req,res){
	var req = req,
		res = res;
	return function(txt){
		status = 404;
		var txt=txt||'';
		res.writeHead(status, {
			'Content-Type' : 'text/html'
		});
		var temp = fs.readFileSync('./templates/404.html', "utf8");
		temp = temp.replace(/{-content-}/,txt)
		res.write(temp);
		res.end();
		
		logger(req,404);
	}
}

exports.start = function(req,res){
	return {
		'json' : json(req,res),
		'html' : html(req,res),
		'define' : define(req,res),
		'notFound' : notFound(req,res),
		'error' : error(req,res),
	}
}

