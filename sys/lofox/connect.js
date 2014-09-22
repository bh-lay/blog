/**
 * @author bh-lay
 */
/**
 *	@DEMO
 *	var connectFN = require('./connect');
 *	var connect = new connectFN(req,res);
 *
 */

var fs = require('fs');
var zlib = require("zlib");
var parse = require('./parse.js');
var SESSION = require('./session.js');


//统一返回客户端信息方法
function send (status,headers,content){
	
	var _this = this;
	
	var headers = headers || {};
	headers['server'] = 'nodejs';
	headers['Connection'] = 'keep-alive';
	headers['Content-Encoding'] = 'gzip';
	this.response.statusCode = status;
	for(var i in headers){
		this.response.setHeader(i,headers[i]);
	}
	var content = content || null;
	
	if(content){
		zlib.gzip(content, function(err, result) {
			_this.response.end(result);
		});
	}else{
		this.response.end();
	}
	return
	// logger ////////////////////////////////////
	var logger = {
		'time':new Date(),
		'ip':this.request['connection']['remoteAddress'],
		'ip2' : this.request['headers']['x-forwarded-for'] ,
		'url':this.request.url,
		'user-agent':this.request.headers['user-agent'],
		'status' : status
	};
	console.log(logger);
}
//格式化cookie
function parseCookie(str){
	var str = str ||'';
	var cookieData = {};
	
	var list = str.split(';');
	
	for(var i = 0 , t = list.length ; i < t ; i++){
		var parseList = list[i].split('=');
		var nameStr = parseList[0]||'';
		var name = nameStr.replace(/^\s+|\s+$/g,'');
		var value = parseList[1]||'';
		
		cookieData[name] = value;
	}
	return cookieData;
}
/**
 * response json data
 *   data can be object or string
 */
function sendJSON(data){
	var json_str ='';
	if(typeof(data) == 'string'){
		json_str = data;
	}else{
		json_str = JSON.stringify(data);
	}
	send.call(this,200,{
		'Content-Type' : 'application/json',
		'charset' : 'utf-8',
	},json_str);
}
/**
 * response html page
 */
function sendHTML(status,content){
	send.call(this,status,{
		'Content-Type' : 'text/html',
		'charset' : 'utf-8'
	},content);

}

/**
 * 单次连接类
 *
 */
function CONNECT(req,res){
	this.url = parse.url(req.url);
	this.request = req;
	this.response = res;
	this._session = null;
}
/**	//向客户端发送信息
 *	connect.write('json',{
 *		code:1,
 *		msg:'msg text !'
 *	});
 *	connect.write('html,200,'html text');
 *	connect.write('define',200,{
 *		content-type:'text/html'
 *	},'<html></html>');
 *	connect.write('notFound','not found');
 *	connect.write('error','something wrong');
 */
CONNECT.prototype['write'] = function(type,a,b,c){
	switch(type){
		case 'json':
			sendJSON.call(this,a);
		break
		case 'html':
			sendHTML.call(this,a,b);
		break
		case 'define':
			send.call(this,a,b,c);
		break
		case 'notFound':
			sendHTML.call(this,404,a);
		break
		case 'error':
			sendHTML.call(this,500,'<h1>' + a + '</h1><p>hello! my name is BUG !</p>');
		break
	}
}
/**
 *	//获取cookie
 *	connect.cookie();
 *	//写入cookie
 *	connect.cookie({
 *		'session_verify' : sessionID,
 *		'path' : '/',
 *		'Max-Age' : 60*60*24*2
 *	},{
 *		'UID':'23w',
 *		'path':'/admin'
 *	}); 
 */
CONNECT.prototype['cookie'] = function(){
	if(arguments.length){
		//写入cookie
		var cookieObj = arguments;
		for(var i in cookieObj){
			var cookie_this = cookieObj[i];
			var cookie_str = '';
			for(var i in cookie_this){
				cookie_str += i + '=' + cookie_this[i] +';';
			}
			this.response.setHeader('Set-Cookie',cookie_str);	
		}
	}else{
		//获取cookie
		return parseCookie(this.request.headers.cookie || '');
	}
};
/**
 *	session相关操作
 *
 *	//启动session模块
 *	connect.session(function(methods){
 *		//获取session
 *		var UID = methods.get('UID');
 *		//设置session
 *		methods.set({
 *			'UID' : 324
 *		});
 *		//校验权限
 *		var canIDo = methods.power(23);
 *	});
 */
CONNECT.prototype['session'] = function(callback){
	var me = this;
	if(this._session){
		//session已被打开,直接使用
		callback&&callback(this._session);
	}else{
		//启用session
		var cookie = this.cookie();
		this._session = new SESSION(cookie,function(cookieObj){
			me.cookie(cookieObj);
		},function(){
			callback&&callback(me._session);
		});
	}
};
//	var IP = req['connection']['remoteAddress'];
//	var userAgent = req['headers']['user-agent'];

module.exports = CONNECT;