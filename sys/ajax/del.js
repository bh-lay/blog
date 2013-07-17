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
			'from' : 'blog',		blog/share/opus/user
			'id' : '' ;
		}, 
	});

***************************************************************/

var querystring=require('querystring');
var mongo = require('../conf/mongo_connect');
var session = require('../lib/session');
var response = require('../lib/response');

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
	}
}



/**
 * delet method
 * @param {id,collection_name,need_power},res,session_this
 */ 
function DELET(param,res,session_this){
	var id = param['id'],
		collection_name = param['collection_name'],
		need_power = param['need_power'],
		res = res,
		session_this = session_this;
		
	if(session_this.power(need_power)){
		mongo.start(function(method){
		
			method.open({'collection_name':collection_name},function(err,collection){
			
				collection.remove({id:id},function(err,docs){
					if(err) {  
						console.log('ERROR');
						response.json(res,{
							'code' : 2,
							'msg' : 'maybe something wrong !'
						});
					}else {
						response.json(res,{
							'code' : 1,
							'msg' : 'delete user sucuss !'
						});
					}
					method.close();
				});
			});
		});
	}else{
		response.json(res,{
			'code' : 2,
			'msg' : 'no power！'
		});
	}
}


exports.render = function (req,res){
	var dataString = req.url.split('?')[1]||'',
		data = querystring.parse(dataString);
	
	var from = data['from']||'';
	
	var param = {
		'id' : data['id']||'',
		'power' : null
	};
	
	if(param['id'].length<2){
		response.json(res,{
			'code' : 2,
			'msg' : 'please input [id] for del !'
		});
	}else if(from.length<2){
		response.json(res,{
			'code' : 2,
			'msg' : 'please input [from] for del !'
		});
	}else{
		//check ['from'] is exist
		if(del_conf[from]){
			var session_this = session.start(req,res);
			
			param['collection_name'] = del_conf[from]['collection_name'];
			param['need_power'] = del_conf[from]['power'];
			
			DELET(param,res,session_this);
		}else{
			response.json(res,{
				'code' : 2,
				'msg' : 'please check [from] in [blog/share/opus/user] !'
			});
		}
	}
}
