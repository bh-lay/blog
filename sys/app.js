//author bh-lay
var http = require('http');
var layFile = require('./lib/layFile');
var session = require('./lib/session');

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
	pathname = pathname.replace(/\.\./g, "");

//router
	var bingo=false;

	// check 301 router
	if(url_redirect[pathname]){
		bingo = true;
		res.writeHead(301, {'location':url_redirect[pathname]});
		res.end();
	}else{
	// check module next
		for(var i = 0,total = dealModule.length; i < total ;i++){
			if(!bingo&&pathname.match(dealModule[i]['reg'])){
				require('./'+dealModule[i]['require']).deal(req,res,pathname);
				bingo = true;
				break;
			}
		}
	// check templates next
		for(var i = 0 in templates){
			if(!bingo&&pathname.match(templates[i]['reg'])){
				require(templates[i]['require']).deal(req,res,pathname);
				bingo = true;
				break;
			}
		}
		// read static file 
		if(!bingo){
			layFile.read(req,res);
		}
	}
	//FIXME logger is not complete
	var logger={
		'time':new Date(),
		'ip':req['connection']['remoteAddress'],
		'url':req.url,
		'user-agent':req.headers['user-agent'],
	};
	console.log(logger);
}).listen(3000, '0.0.0.0');


