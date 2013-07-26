//author bh-lay
var http = require('http');
var layFile = require('./lib/layFile');
var session = require('./lib/session');
var response = require('./lib/response');

/*301  URL redirection*/
var url_redirect = require('./conf/301url');

/* templates config */
var templates = require('./conf/templates');

/* render config*/
var dealModule = [
	{
		'name' : 'ajax',
		'reg': /^\/ajax\//,
		'require' :'ajax.js'
	},
	{
		'name' : 'admin',
		'reg': /^\/admin/,
		'require' :'admin.js'
	}
];

/*server start*/
var server=http.createServer(function (req,res) {

	var pathname = req.url.split('?')[0];

	var res_this = response.start(req,res);

	pathname = pathname.replace(/\.\./g, "");

//router
	var bingo=false;

	// check 301 router
	if(url_redirect[pathname]){
		bingo = true;
		res_this.define(301,{
			'location':url_redirect[pathname]
		});
	}else{
	// check module next
		for(var i = 0,total = dealModule.length; i < total ;i++){
			if(!bingo&&pathname.match(dealModule[i]['reg'])){
				require('./'+dealModule[i]['require']).deal(req,res,res_this,pathname);
				bingo = true;
				break;
			}
		}
	// check templates next
		for(var i = 0 in templates){
			if(!bingo&&pathname.match(templates[i]['reg'])){
				require(templates[i]['require']).deal(req,res,res_this,pathname);
				bingo = true;
				break;
			}
		}
		// read static file 
		if(!bingo){
			layFile.read(req,res_this);
		}
	}
}).listen(3000, '0.0.0.0');


