/**
 * @author bh-lay
 */
/**
	@DEMO
	var response = require('./response');
	var res_this = response.start(req,res);
	
	res_this.json({code:1,msg:'msg text !'});
	or
	res_this.html(200,'html text');
	or
	res_this.define(200,{content-type:'text/html'},'<html></html>');
	or
	res_this.notFound('not found');
	or
	res_this.error('error');
	 
*/

var fs = require('fs');
var zlib = require("zlib");

function send_res(req,res,status,headers,content){
	
	headers['Content-Encoding'] = 'gzip';
	
	res.writeHeader(status,headers);
	
	content = content || null;
	
	zlib.gzip(content, function(err, result) {
		res.end(result);
	});
	
	var logger = {
		'time':new Date(),
		'ip':req['connection']['remoteAddress'],
		'url':req.url,
		'user-agent':req.headers['user-agent'],
		'status' : status
	};
	console.log(logger);
}

//response json data
function json(req,res){
	var req = req,
		res = res;
	return function(data){
		
		send_res(req,res,200,{
			'Content-Type' : 'application/json',
			'charset' : 'utf-8',
		},JSON.stringify(data));
		
	}
	
}

//response html page

function html(req,res){
	var req = req,
		res = res;
	return function(status,content){
		
		send_res(req,res,status,{
			'Content-Type' : 'text/html',
			'charset' : 'utf-8',
			'server' : 'node.js',
		},content);

	}
}

//response define data
function define(req,res){
	var req = req,
		res = res;
	return function(status,headers,content){
		
		send_res(req,res,status,headers,content);
		
	}
}

var notFoundTemp = fs.readFileSync('./templates/404.html', "utf8");

//response not found
function notFound(req,res){
	var req = req,
		res = res;
	return function(txt){
		var txt=txt||'';
		
		var content = notFoundTemp.replace(/{-content-}/,txt);

		send_res(req,res,404,{
			'Content-Type' : 'text/html'
		},content);

	}
}

//response error
function error(req,res){
	var req = req,
		res = res;
	return function(txt){
		
		send_res(req,res,500,{
			'Content-Type' : 'text/plain'
		},'hello! my name is BUG !');
		
	}
}

exports.start = function(req,res){
	return {
		'json' : json(req,res),
		'html' : html(req,res),
		'define' : define(req,res),
		'notFound' : notFound(req,res),
		'error' : error(req,res),
		'response' : res,
	}
}

