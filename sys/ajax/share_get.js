/*
 * @author bh-lay
 */
/*
@demo
-----------------------------------------------------------------
get_list: 								|		get_detail
	$.ajax({                      |       	$.ajax({
		'type':'GET',              |       		'type':'GET',
		'url':'/ajax/share',       |       		'url':'/ajax/share',
		'data':{                   |       		'data':{
			'act' : 'get_list',     |       			'act' : 'get_detail',
			'limit_num' : '12',		|					'id' :'123456789'
			'skip_num' : '34'			|				}
		}	       						|       	});
	});                           |
-----------------------------------------------------------------
 */

var mongo = require('../conf/mongo_connect');
var fs = require('fs');
var querystring=require('querystring');

function get_list(data,res_this){
	var data = data,
		limit_num = parseInt(data['limit'])||10,
		skip_num = parseInt(data['skip'])||0;
	
	var resJSON = {
		'code':1,
		'limit':limit_num,
		'skip':skip_num,
	};
	
	mongo.start(function(method){
		method.open({'collection_name':'share'},function(err,collection){
	      //count the all list
	      collection.count(function(err,count){
	      	resJSON['count'] = count;
	      });
	      
	      collection.find({},{limit:limit_num}).sort({id:-1}).skip(skip_num).toArray(function(err, docs) {
				if(err){
					resJSON.code = 2;
				}else{
					for(var i=0 in docs){
						delete docs[i]['content'];
					}
					resJSON['list'] = docs;
				}
				res_this.json(resJSON);
				method.close();
			});
		});
	});
}
function get_detail(data,res_this){
	var data=data,
		articleID = data['id'];
	
	var resJSON={
		'code':1,
		'id' : data['id'],
	};
	mongo.start(function(method){
		method.open({'collection_name':'share'},function(err,collection){
			collection.find({id:articleID}).toArray(function(err, docs) {
				if(arguments[1].length==0){
					resJSON['code'] = 2;
					resJSON['msg'] = 'could not find this share !';				
				}else{ 
					resJSON['detail'] = docs[0];
				}
				
				res_this.json(resJSON);
				method.close();
			});
		});
	});
}

exports.render = function (req,res_this,res){
	var search = req.url.split('?')[1],
		data = querystring.parse(search);
	
	if(data['act']=='get_list'){
	
		get_list(data,res_this,res);
		
	}else if(data['act']=='get_detail'){
		if(data['id']){
			get_detail(data,res_this,res);
		}else{
			res_this.json({
				'code' : 2,
				'msg' : 'plese tell me which shere you want to get !'
			});
		}
	}else{
		res_this.json({
			'code' : 2,
			'msg' : 'plese use [act] get_detail or get_list !'
		});
	}
}
