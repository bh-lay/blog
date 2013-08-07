/**
 * @author bh-lay
 * 
 */

var http = require('http');
var layFile = require('./mod/layFile');
var response = require('./mod/response');
var parse = require('./lib/parse');

// 301  URL redirection
var url_redirect = require('./conf/301url');

// templates config
var templates = require('./conf/templates');

/* render config*/
var dealModule = {
	'ajax' : 'ajax.js',
	'admin' : 'admin.js'
};

// server start
var server = http.createServer(function (req,res) {

	var res_this = response.start(req,res);
	
	var path = parse.url(req.url);
	var pathname = path.pathname;
	//path['pathnode'][0]

//router
	if(url_redirect[pathname]){
	// check 301 router
		res_this.define(301,{
			'location':url_redirect[pathname]
		});
	}else if(dealModule[path['pathnode'][0]]){
	// check module next
		require('./'+dealModule[path['pathnode'][0]]).deal(req,res_this,pathname);

	}else{
	// check templates
		var bingo = false;
		for(var i = 0 in templates){
			if(!bingo&&pathname.match(templates[i]['reg'])){
				require(templates[i]['require']).deal(req,res_this,pathname);
				bingo = true;
				break;
			}
		}
		// read static file 
		if(!bingo){
			layFile.read(req,res_this);
		}
	}
});

server.listen(3000, '0.0.0.0');


