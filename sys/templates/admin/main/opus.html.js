//author bh-lay

var fs = require('fs');
var url = require('url');
var temp=fs.readFileSync('./templates/admin/main/opus.html', "utf8");
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
	var opusID=querystring.parse(search).opusID;
	if(opusID){
		var method = mongo.start();
		
		method.open({'collection_name':'opus'},function(err,collection){
			
			collection.find({'id':opusID}).toArray(function(err, docs) {		
				var txt=valueInit(docs[0]);
				
				res_this.html(200,txt);
									
				method.close();
			});
		});
	}else{
		res_this.html(200,valueInit({}));
	}
}
