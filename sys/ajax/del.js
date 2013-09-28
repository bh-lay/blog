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
			'from' : 'blog',		blog/share/opus/user/blog_friend
			'id' : '' ;
		}, 
	});

***************************************************************/

var querystring = require('querystring');
var mongo = require('../conf/mongo_connect');
var session = require('../mod/session');

var del_conf = {
	'blog' : {
		'collection_name' : 'article',
		'power' : 4
	},
	'share' : {
		'collection_name' : 'share',
		'power' : 7
	},
	'opus' : {
		'collection_name' : 'opus',
		'power' : 10
	},
	'user' : {
		'collection_name' : 'user',
		'power' : 13
	},
	'blog_friend' : {
		'collection_name' : 'blog_friend',
		'power' : 18
	}
}



/**
 * delet method
 * @param {id,collection_name,need_power},res_this,session_this
 */ 
function DELET(param,res_this,session_this){
	var id = param['id'],
		collection_name = param['collection_name'],
		need_power = param['need_power'],
		res_this = res_this,
		session_this = session_this;
		
	if(session_this.power(need_power)){
		mongo.start(function(method){
		
			method.open({'collection_name':collection_name},function(err,collection){
			
				collection.remove({id:id},function(err,docs){
					if(err) {  
						console.log('ERROR');
						res_this.json({
							'code' : 2,
							'msg' : 'maybe something wrong !'
						});
					}else {
						res_this.json({
							'code' : 1,
							'msg' : 'delete sucuss !'
						});
					}
					method.close();
				});
			});
		});
	}else{
		res_this.json({
			'code' : 2,
			'msg' : 'no power！'
		});
	}
}


exports.render = function (req,res_this){

	var dataString = req.url.split('?')[1]||'',
		data = querystring.parse(dataString);
	
	var from = data['from']||'';
	
	var param = {
		'id' : data['id']||'',
		'power' : null
	};
	
	if(param['id'].length<2){
		res_this.json({
			'code' : 2,
			'msg' : 'please input [id] for del !'
		});
	}else if(from.length<2){
		res_this.json({
			'code' : 2,
			'msg' : 'please input [from] for del !'
		});
	}else{
		//check ['from'] is exist
		if(del_conf[from]){
			var session_this = session.start(req,res_this);
			
			param['collection_name'] = del_conf[from]['collection_name'];
			param['need_power'] = del_conf[from]['power'];
			
			DELET(param,res_this,session_this);
		}else{
			res_this.json({
				'code' : 2,
				'msg' : 'please check [from] in [blog/share/opus/user] !'
			});
		}
	}
}
