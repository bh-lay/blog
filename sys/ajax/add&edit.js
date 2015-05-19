/**
 * @author bh-lay
 * 
 */

var mongo = require('../core/DB.js');
var utils = require('../core/utils/index.js');

function add(parm,collection_name,callback){
	var parm = parm;
	
	var method = mongo.start();

	method.open({
    collection_name: collection_name
  },function(err,collection){
		if(err){
			callback && callback(err);
			return
		}
		parm.id = utils.createID();

		collection.insert(parm,function(err,result){
			if(err){
				callback && callback(err);
				return
			}
			callback && callback(null);
			
			method.close();
		});
	});
}
function edit(parm,collection_name,callback){
	var parm = parm;
	
	var method = mongo.start();
	
	method.open({
    collection_name: collection_name
  },function(error,collection){
		collection.update({
      id: parm.id
    }, {
      $set:parm
    }, function(err,docs) {
			if(err) {
				callback && callback(err);
			}else {
				callback && callback(null);
			}
			method.close();
		});
	});
}

////////////////////////////////////////////////
function filter_request(connect,callback){

	connect.session(function(session_this){
		var need_power,
			error = null,
			data_filter = {
				data : {},
				collection_name : null
			};
		
		utils.parse.request(connect.request,function(err,data){
			var category = data['category'] || '';
			switch(category){
				case 'blog' :
					data_filter = filter_request.blog(data);
					data_filter['collection_name'] = 'article';
					need_power = 3;
					break
				case 'labs' :
					data_filter = filter_request.labs(data);
					data_filter['collection_name'] = 'labs';
					need_power = 3;
					break
				default :
					error = 'please input category [blog,labs]';
			}
			if(!session_this.power(need_power)){
				error = 'no power';
			}
			callback(error,data_filter);
		});	
	});

}

filter_request.blog = function(data){
	var error = null;
	var param = {
		id : data['id']||null,
		title :decodeURI(data['title']),
		cover: data['cover']||'',
		time_show: data['time_show'] || new Date().getTime().toString(),
		tags: data['tags'] ? data['tags'].split(/\s*\,\s*/) : [],
		author: data['author']||'',
		content: data['content'],
		intro: data['intro'] || data['content'].slice(0,200),
	};
	if(!(param['title']&&param['content'])){
		error = 'please insert complete code !';
	}
	return {error:error,data:param};
}

filter_request.labs = function(data){
	var error = null;
	var param = {
		'id' : data['id']||'',
		'name' : data['name']||'',
		'title':decodeURI(data['title']),
		'cover':data['cover']||'',
		'time_create':data['time_create']||new Date().getTime(),
		'content':data['content'],
		'git_full_name' : data['git_full_name'],
		'demo_url' : data['demo_url'],
		'intro':data['intro'] || data['content'].slice(0,200),
	};
	if(!(param['title']&&param['content'])){
		error = 'please insert complete code !';
	}
	return {
		'error' : error,
		'data' : param
	};
}

//////////////////////////////////////////////////////
exports.render = function (connect,app){

	filter_request(connect,function(err,param){
		if(err){
			connect.write('json',{
				'code':2,
				'msg':err
			});
			return
		}
		var data = param['data'],
			collection_name = param['collection_name'];
		
		if(data['id']&&data['id'].length > 2){
			edit(data,collection_name,function(err){
				if(err){
					connect.write('json',{
						code:2,
						msg: 'edit fail !'
					});
				}else{
					connect.write('json',{
						code: 1,
						id : data.id,
						msg: 'edit success !'
					});
					app.cache.clear();
				}
			});
		}else{
			add(data,collection_name,function(err){
				if(err){
					connect.write('json',{
						code: 2,
						msg: 'edit fail !'
					});
				}else{
					connect.write('json',{
						code: 1,
						id : data.id,
						msg: 'edit success !'
					});
					app.cache.clear();
				}
			});
		}
	});
}
