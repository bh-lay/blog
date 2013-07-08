//author bh-lay

var fs = require('fs');
var url = require('url');
var temp=fs.readFileSync('./templates/admin/share/share.html', "utf8");
var mongo = require('../../../conf/mongo_connect');
var querystring=require('querystring');

function valueInit(data){
	var txt=temp.replace(/\{(\w*)}/g,function(){
		return data[arguments[1]]||'';
	});
	return txt;
}
exports.render = function (req,res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	var search=url.parse(req.url).search;
	search&&(search=search.replace('?',''));
	var shareID=querystring.parse(search).shareID;
	if(shareID){
		mongo.open({'collection_name':'share'},function(err,collection,close){
			collection.find({'id':shareID}).toArray(function(err, docs) {		
				var txt=valueInit(docs[0]);
				res.write(txt);
				res.end();
				close();
			});
		});
	}else{
		res.end(valueInit({}));
	}
}
