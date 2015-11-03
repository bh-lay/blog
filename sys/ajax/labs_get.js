/*
 * @author bh-lay
 */
/*
@demo
-----------------------------------------------------------------
get_list: 								|		get_detail
	$.ajax({                      |       	$.ajax({
		'type':'GET',              |       		'type':'GET',
		'url':'/ajax/blog',        |       		'url':'/ajax/blog',
		'data':{                   |       		'data':{
			'act' : 'get_list',     |       			'act' : 'get_detail',
			'limit_num' : '12',		|					'id' :'123456789'
			'skip_num' : '34'			|				}
		}	       						|       	});
	});                           |
-----------------------------------------------------------------
 */

var mongo = require('../core/DB.js');
var fs = require('fs');
var querystring=require('querystring');
//var markdown = require('markdown');
var showdown = require('../lib/showdown/showdown.js');
var converter = new showdown.converter();

function get_list(data,callback){
	var data = data,
		limit_num = parseInt(data['limit'])||10,
		skip_num = parseInt(data['skip'])||0;
	
	var resJSON = {
		code: 200,
		limit: limit_num,
		skip: skip_num,
	};
	
	var method = mongo.start();
	method.open({'collection_name':'labs'},function(err,collection){
    if(err){
      resJSON.code = 500;
      callback&&callback(resJSON);
      return
    }
    //count the all list
		collection.count(function(err,count){
			resJSON['count'] = count;
			
			collection.find({},{limit:limit_num}).sort({id:-1}).skip(skip_num).toArray(function(err, docs) {
				method.close();
				if(err){
					resJSON.code = 2;
				}else{
					for(var i=0 in docs){
						delete docs[i]['content'];
					}
					resJSON['list'] = docs;
				}
				callback&&callback(resJSON);
			});
		});
	});
}
function get_detail(data,callback){
	var data=data,
		labID = data['id'];
	
	var resJSON={
		code: 200,
		id : labID
	};
	var method = mongo.start();
	method.open({'collection_name':'labs'},function(err,collection){
		collection.find({id:labID}).toArray(function(err, docs) {
			method.close();
			if(arguments[1].length==0){
				resJSON['code'] = 2;
				resJSON['msg'] = 'could not find this lab ' + labID + ' !';				
			}else{ 
				resJSON['detail'] = docs[0];
			}
			callback&&callback(resJSON);
		});
	});
}

function this_control(connect,callback){
	var data = connect.url.search;
	
	if(data['act']=='get_list'){
		get_list(data,function(json_data){
			callback&&callback(json_data);
		});
		
	}else if(data['act']=='get_detail'){
		if(data['id']){
			get_detail(data,function(json_data){
				callback&&callback(json_data);
			});
		}else{
			callback&&callback({
				'code' : 2,
				'msg' : 'plese tell me which lab you want to get !'
			});
		}
	}else{
		callback&&callback({
			'code' : 2,
			'msg' : 'plese use [act] get_detail or get_list !'
		});
	}
}

exports.render = function (connect,app){
	var url = connect.request.url;

	app.cache.use(url,['ajax','labs'],function(this_cache){
		connect.write('json',this_cache);
	},function(save_cache){
		this_control(connect,function(this_data){
			save_cache(JSON.stringify(this_data));
		});
	});
}