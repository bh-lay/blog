/**
 * @author bh-lay
 * 
 */

var http = require('http'),
	layFile = require('./mod/layFile'),
	response = require('./mod/response');

// 301 and controller
var url_redirect = require('./conf/301url'),
	controller = require('./conf/controller');

//define global object
global.parse = require('./lib/parse');
global.cache = require('./mod/cache');
global.CONFIG = require('./conf/app_config');

//////////////////////////////////////////
var app_port = CONFIG.port,
	app_ip = CONFIG.ip;

// server start
var server = http.createServer(function (req,res) {

	var res_this = response.start(req,res);
	
	var path = parse.url(req.url);
	var pathname = path.pathname;

	if(url_redirect[pathname]){
		// check 301 router
		res_this.define(301,{
			'location' : url_redirect[pathname]
		});
	}else if(controller[path['root']]){
		// check controller next
		require('.' + controller[path['root']]).deal(req,res_this,path);
	}else{
		// read static file
		layFile.read(req,res_this);
	}
});

server.listen(app_port, app_ip);
console.log('server has been start at ' + app_port + ' port !');