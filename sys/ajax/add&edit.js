/**
 * @author bh-lay
 * 
 */

var mongo = require('../conf/mongo_connect');
var session = require('../mod/session');

function add(parm,res_this,collection_name){
	var parm = parm;
	
	var method = mongo.start();

	method.open({'collection_name':collection_name},function(err,collection){
		collection.find({}, {}).toArray(function(err, docs) {
			
			parm.id = parse.createID();

			collection.insert(parm,function(err,result){
				if(err){console.log('error');}
				res_this.json({
					'code' : 1,
					'id' : parm.id,
					'msg' : 'add sucess !'
				});
				method.close();
			});
		});
	});
}
function edit(parm,res_this,collection_name){
	var parm = parm;
	
	var method = mongo.start();
		
	method.open({'collection_name':collection_name},function(error,collection){
		collection.update({'id':parm.id}, {$set:parm}, function(err,docs) {
			if(err) {
				res_this.json({
					'code' : 2,
					'id' : parm.id,
					'msg' : 'edit blog fail !'
				});       
			}else {
				res_this.json({
					'code':1,
					'id' : parm.id,
					'msg':'edit success !'
				});
			}
			method.close();
		});
	});
}

////////////////////////////////////////////////
function filter_request(req,res_this,callback){

	session.start(req,res_this,function(){
		var session_this = this;
		var need_power,
			 data_filter = {
				error:null,
				data : {},
				collection_name : null
			 };
		
		parse.request(req,function(err,data){
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
				default :
					data_filter['error'] = 'please input category [blog,share,opus,blog_friend]';
			}
			if(!session_this.power(need_power)){
				data_filter['error'] = 'no power';
			}
			callback(data_filter);
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
		'tags':data['tags']||'',
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
exports.render = function (req,res_this){

	filter_request(req,res_this,function(param){
		var error = param['error'],
			data = param['data'],
			collection_name = param['collection_name'];
		if(error){
			res_this.json({
				'code':2,
				'msg':error
			});
			return
		}
		if(data['id']&&data['id'].length>2){
			edit(data,res_this,collection_name);
		}else{
			add(data,res_this,collection_name);
		}
	});
}