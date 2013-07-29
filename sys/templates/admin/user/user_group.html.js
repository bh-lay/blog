/**
 * @author bh-lay
 * 
 * url  path + /user.html?userid=____
 */

var fs = require('fs');
var url = require('url');
var temp=fs.readFileSync('./templates/admin/user/user_group.html', "utf8");
var querystring=require('querystring');
var mongo = require('../../../conf/mongo_connect');


function valueInit(data){
	var txt = temp.replace(/\{(\w*)}/g,function(){
		return data[arguments[1]]||'';
	});
	return txt;
}
exports.render = function (req,res_this){

	var search=url.parse(req.url).search;
	search&&(search=search.replace('?',''));
	var ID = querystring.parse(search).id;
	if(ID){
		mongo.start(function(method){
			
			method.open({'collection_name':'user_group'},function(err,collection){
				
				collection.find({'id':ID}).toArray(function(err, docs) {		
					var txt = valueInit(docs[0]);
					
					res_this.html(200,txt);
					
					method.close();
				});
			});
		});
	}else{
		res_this.html(200,valueInit({}));
	}
}
