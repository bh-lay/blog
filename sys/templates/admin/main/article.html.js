//author bh-lay

var fs = require('fs');
var url = require('url');
var temp = fs.readFileSync('./templates/admin/main/article.html', "utf8");
var querystring=require('querystring');
var mongo = require('../../../conf/mongo_connect');

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
	var articleID=querystring.parse(search).articleID;
	if(articleID){
		mongo.start({'collection_name':'article'},function(err,collection,close){
			collection.find({'id':articleID}).toArray(function(err, docs) {		
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
