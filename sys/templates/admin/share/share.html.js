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
exports.render = function (req,res_this){
	var search=url.parse(req.url).search;
	search&&(search=search.replace('?',''));
	var shareID=querystring.parse(search).shareID;
	if(shareID){
		var method = mongo.start();
		method.open({'collection_name':'share'},function(err,collection){
			collection.find({'id':shareID}).toArray(function(err, docs) {		
				var txt=valueInit(docs[0]);
				
				res_this.html(200,txt);
				
				method.close();
			});
		});
	}else{
		res_this.html(200,valueInit({}));
	}
}
