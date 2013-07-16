/*
 * @author bh-lay
 */
var mongo = require('../conf/mongo_connect');
var fs = require('fs');
var querystring=require('querystring');

function get_list(data,res){
	var res = res,
		data=data,
		limit_num = parseInt(data['limit'])||10,
		skip_num = parseInt(data['skip'])||0;
	
	var resJSON={
		'code':1,
		'limit':limit_num,
		'skip':skip_num,
	};
	mongo.start(function(method){
		method.open({'collection_name':'article'},function(err,collection){
	      //count the all list
	      collection.count(function(err,count){
	      	resJSON['count'] = count;
	      });
	      
	      collection.find({},{limit:limit_num}).sort({id:-1}).skip(skip_num).toArray(function(err, docs) {
				if(err){
					resJSON.code=2;
				}else{
					for(var i=0 in docs){
						delete docs[i]['content'];
					}
					resJSON['list'] = docs;
				}
				res.write(JSON.stringify(resJSON));
				res.end();
				method.close();
			});
		});
	});
}
function get_detail(data,res){
	var res = res,
		data=data,
		articleID = data['id'];
	
	var resJSON={
		'code':1,
		'id' : data['id'],
	};
	mongo.start(function(method){
		method.open({'collection_name':'article'},function(err,collection){
			collection.find({id:articleID}).toArray(function(err, docs) {
				if(arguments[1].length==0){
					resJSON['code'] = 2;
					resJSON['msg'] = 'could not find this blog !';				
				}else{ 
					resJSON['detail'] = docs[0];
					delete resJSON['detail']['_id'];
				}
				res.write(JSON.stringify(resJSON));
				res.end();
				method.close();
			});
		});
	});
}

exports.render = function (req,res){
	var search = req.url.split('?')[1],
		data=querystring.parse(search);
	if(data['act']=='get_list'){
		get_list(data,res);
	}else if(data['act']=='get_detail'){
		if(data['id']){
			get_detail(data,res);
		}else{
			res.end('{\'code\':2,\'msg\':\'plese tell me which blog article you want to get !\'}');
		}
	}else{
		res.end('{\'code\':2,\'msg\':\'plese use [act] get_detail or get_list !\'}');
	}
}
