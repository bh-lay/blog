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

function connect(req,res){
	this.req = req;
	this.res = res;
	var _this = this;
	//Unified use send response method
	this.send = function (status,headers,content){
		
		var headers = headers || {};
		headers['server'] = 'nodejs';
		headers['Connection'] = 'keep-alive';
		headers['Content-Encoding'] = 'gzip';
		
		this.res.writeHeader(status,headers);
		
		var content = content || null;
		
		if(content){
			zlib.gzip(content, function(err, result) {
				_this.res.end(result);
			});
		}else{
			this.res.end();
		}
		// logger ////////////////////////////////////
		//x-forwarded-for
		var ip = this.req['connection']['x-forwarded-for'] || this.req['connection']['remoteAddress'];
		
		var logger = {
			'time':new Date(),
			'ip':ip,
			'url':this.req.url,
			'user-agent':this.req.headers['user-agent'],
			'status' : status
		};
		console.log(logger);
	}
}

connect.prototype = {
	//response json data
	'json' : function(data){
		this.send(200,{
			'Content-Type' : 'application/json',
			'charset' : 'utf-8',
		},JSON.stringify(data));
	},
	//response html page
	'html' : function(status,content){
		this.send(status,{
			'Content-Type' : 'text/html',
			'charset' : 'utf-8',
		},content);

	},
	//response define data
	'define' : function(status,headers,content){
		this.send(status,headers,content);
	},
	//response not found
	'notFound' : function(txt){
		var txt=txt||'';
		
		var content = notFoundTemp.replace(/{-content-}/,txt);

		this.send(404,{
			'Content-Type' : 'text/html'
		},content);
	},
	//response error
	'error' : function(txt){
		this.send(500,{
			'Content-Type' : 'text/plain'
		},'hello! my name is BUG !');
	},
	//response cookie
	'cookie' : function(){
		var cookieObj = arguments;
		for(var i in cookieObj){
			var cookie_this = cookieObj[i];
			var cookie_str = '';
			for(var i in cookie_this){
				cookie_str += i + '=' + cookie_this[i] +';';
			}
			this.res.setHeader('Set-Cookie',cookie_str);	
		}
	}
};

exports.start = function(req,res){
	return new connect(req,res);
};