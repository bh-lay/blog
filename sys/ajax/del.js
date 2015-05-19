/**
 * @author bh-lay
 * 
 */
/**************************************************************
@ demo
	$.ajax({
		'type':'GET',
		'url':'/ajax/del',
		'data':{
			'from' : 'blog',		blog/user/blog_friend
			'id' : '' ;
		}, 
	});

***************************************************************/

var querystring = require('querystring');
var mongo = require('../core/DB.js');

var del_conf = {
	'blog' : {
		'collection_name' : 'article',
		'power' : 4
	},
	'labs' : {
		'collection_name' : 'labs',
		'power' : 4
	},
	'user' : {
		'collection_name' : 'user',
		'power' : 13
	},
	'user_group' : {
		'collection_name' : 'user_group',
		'power' : 16
	},
	'blog_friend' : {
		'collection_name' : 'blog_friend',
		'power' : 18
	},
	'power' : {
		'collection_name' : 'power',
		'power' : 20
	}
}



/**
 * delet method
 * @param {id,collection_name,need_power},res_this,session_this
 */ 
function DELET(param,session_this,callback){
	var id = param['id'],
		collection_name = param['collection_name'],
		need_power = param['need_power'],
		session_this = session_this;
		
	if(session_this.power(need_power)){
		var method = mongo.start();
		
		method.open({'collection_name':collection_name},function(err,collection){
		
			collection.remove({id:id},function(err,docs){
				if(err) {  
					callback && callback('系统出错');
				}else {
					callback && callback(null);
				}
				method.close();
			});
		});
	}else{
		callback && callback('no power');
	}
}


exports.render = function (connect,app){

	var data = connect.url.search;
	
	var from = data['from']||'';
	
	var param = {
		'id' : data['id'] || '',
		'power' : null
	};
	if(connect.request.method != 'POST'){
		connect.write('json',{
			'code' : 201,
			'msg' : 'please use POST to delete !'
		});
		return
	}
	if(param['id'].length<2){
		connect.write('json',{
			'code' : 2,
			'msg' : 'please input [id] for del !'
		});
	}else if(from.length<2){
		connect.write('json',{
			'code' : 2,
			'msg' : 'please input [from] for del !'
		});
	}else{
		//check ['from'] is exist
		if(del_conf[from]){
			connect.session(function(session_this){
				param['collection_name'] = del_conf[from]['collection_name'];
				param['need_power'] = del_conf[from]['power'];
			
				DELET(param,session_this,function(err){
					if(err){
						connect.write('json',{
							'code' : 201
						});
					}else{
						connect.write('json',{
							'code' : 200
						});
						//清除所有缓存
						app.cache.clear();
					}
				});
			});
		}else{
			connect.write('json',{
				'code' : 2,
				'msg' : 'please check [from] in [blog/user/user_group] !'
			});
		}
	}
}
