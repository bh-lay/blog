/**
 * @author bh-lay
 * 
 */

var mongo = require('../core/DB.js');
var parse = require('../core/parse.js');

function add(parm,collection_name,callback){
	var parm = parm;
	
	var method = mongo.start();

	method.open({'collection_name':collection_name},function(err,collection){
		if(err){
			callback && callback(err);
			return
		}
		parm.id = parse.createID();

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
	
	method.open({'collection_name':collection_name},function(error,collection){
		collection.update({'id':parm.id}, {$set:parm}, function(err,docs) {
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
		
		parse.request(connect.request,function(err,data){
			var category = data['category'] || '';
			switch(category){
				case 'blog' :
					data_filter = filter_request.blog(data);
					data_filter['collection_name'] = 'article';
					need_power = 3;
					break
				case 'share' :
					data_filter = filter_request.share(data);
					data_filter['collection_name'] = 'share';
					need_power = 6;
					break
				case 'opus' :
					data_filter = filter_request.opus(data);
					data_filter['collection_name'] = 'opus';
					need_power = 9;
					break
				case 'blog_friend' :
					data_filter = filter_request.blog_friend(data);
					data_filter['collection_name'] = 'blog_friend';
					need_power = 18;
					break
				case 'labs' :
					data_filter = filter_request.labs(data);
					data_filter['collection_name'] = 'labs';
					need_power = 3;
					break
				default :
					error = 'please input category [blog,share,opus,blog_friend]';
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
		'id' : data['id']||null,
		'title':decodeURI(data['title']),
		'cover':data['cover']||'',
		'time_show':data['time_show']||new Date().getTime(),
		'tags':data['tags'] ? data['tags'].split(/\s*\,\s*/) : [],
		'author':data['author']||'',
		'content':data['content'],
		'intro':data['intro']||data['content'].slice(0,200),
	};
	if(!(param['title']&&param['content'])){
		error = 'please insert complete code !';
	}
	return {error:error,data:param};
}

filter_request.share = function(data){
	var error = null;
	var param = {
		'id' : data['id']||'',
		'title':decodeURI(data['title']),
		'cover':data['cover']||'',
		'time_show':data['time_show']||new Date().getTime(),
		'tags':data['tags']||'',
		'content':data['content'],
		'from':data['from'],
		'from_url':data['from_url'],
		'intro':data['intro']||data['content'].slice(0,200),
	};
	if(!(param['title']&&param['content'])){
		error = 'please insert complete code !';
	}
	return {error:error,data:param};
}

filter_request.opus = function(data){
	var error = null;
	var param = {
		'id' : data['id']||'',
		'title':decodeURI(data['title']),
		'cover':data['cover']||'',
		'opus_pic':data['opus_pic']||'',
		'opus_time_create':data['opus_time_create']||new Date().getTime(),
		'tags':data['tags']||'',
		'content':data['content'],
		'work_range':data['work_range'],
		'online_url':data['online_url'],
		'intro':data['intro']||data['content'].slice(0,200),
	};
	if(!(param['title']&&param['content'])){
		error = 'please insert complete code !';
	}
	return {
		'error' : error,
		'data' : param
	};
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

filter_request.blog_friend = function(data){
	var error = null;
	var param = {
		'id' : data['id']||'',
		'title':decodeURI(data['title']),
		'cover':data['cover']||'',
		'url':data['url']||'',
		'isShow' :data['isShow']||1,//1:show;0:hidden
		'discription':data['discription']
	};
	if(param['id'].length<2){
		param['time_create'] = new Date().getTime();
	}
	if(!(param['title']&&param['url'])){
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
		
		if(data['id']&&data['id'].length>2){
			edit(data,collection_name,function(err){
				if(err){
					connect.write('json',{
						'code':2,
						'msg': 'edit fail !'
					});
				}else{
					connect.write('json',{
						'code':1,
						'id' : data.id,
						'msg':'edit success !'
					});
					app.cache.clear('all');
				}
			});
		}else{
			add(data,collection_name,function(err){
				if(err){
					connect.write('json',{
						'code':2,
						'msg': 'edit fail !'
					});
				}else{
					connect.write('json',{
						'code':1,
						'id' : data.id,
						'msg':'edit success !'
					});
					app.cache.clear('all');
				}
			});
		}
	});
}
