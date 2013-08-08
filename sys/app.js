/**
 * @author bh-lay
 * 
 */

var http = require('http');
var layFile = require('./mod/layFile');
var response = require('./mod/response');
var parse = require('./lib/parse');

// 301 and controller
var url_redirect = require('./conf/301url');
var controller = require('./conf/controller');

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
		require('.'+controller[path['root']]).deal(req,res_this,path);

	}else{
		// read static file
		layFile.read(req,res_this);
	}
});

server.listen(3000, '0.0.0.0');


