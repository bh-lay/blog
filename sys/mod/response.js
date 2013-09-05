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
	res_this.cookie({'session_verify' : sessionID,'path' : '/','Max-Age' : 60*60*24*2},{'UID':'23w','path':'/admin'});
	or
	res_this.error('error');
	 
*/

var fs = require('fs');
var zlib = require("zlib");

var notFoundTemp = fs.readFileSync('./templates/404.html', "utf8");

//FIXME logger 
var logger = (function(){
	
	
})();


//Unified use send response method
function send_res(req,res,status,headers,content){
	
	var headers = headers || {};
	headers['server'] = 'nodejs';
	headers['Connection'] = 'keep-alive';
	headers['Content-Encoding'] = 'gzip';
	
	res.writeHeader(status,headers);
	
	var content = content || null;
	
	if(content){
		zlib.gzip(content, function(err, result) {
			res.end(result);
		});
	}else{
		res.end();
	}
	
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

//response cookie
function cookie(req,res){
	var req = req,
		res = res;
	return function(){
		var cookieObj = arguments;
		for(var i in cookieObj){
			var cookie_this = cookieObj[i];
			var cookie_str = '';
			for(var i in cookie_this){
				cookie_str += i + '=' + cookie_this[i] +';';
			}
			res.setHeader('Set-Cookie',cookie_str);	
		}
	}
}

exports.start = function(req,res){
	return {
		'json' : json(req,res),
		'html' : html(req,res),
		'define' : define(req,res),
		'notFound' : notFound(req,res),
		'error' : error(req,res),
		'cookie' : cookie(req,res),
		'response' : res,
	}
}

