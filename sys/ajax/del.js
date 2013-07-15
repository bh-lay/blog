/**
 * @author bh-lay
 * 
 */
/**
	@ demo
	$.ajax({
		'type':'GET',
		'url':'/ajax/del',
		'data':{
			'from' : 'blog',		blog/share/opus/user
			'id' : '' ;
		}, 
	});

 */

var querystring=require('querystring');
var mongo = require('../conf/mongo_connect');
var session = require('../conf/session');

function response(res,data){
	res.write(JSON.stringify(data));
	res.end();
}

// delete blog 
function del_blog(id,res,session_this){
	if(session_this.power(4)){
		mongo.start({'collection_name':'article'},function(err,collection,close){
			collection.remove({id:id},function(err,docs){  
				if(err) {  
					console.log('ERROR');
			   	 res.end('{\'code\':2,\'msg\':\'maybe something wrong !\'}');        
				}else {
					res.end('{\'code\':1,\'msg\':\'delete sucuss !\'}');
				}
				close();
			});
		});
	}else{
		response(res,{
			'code' : 2,
			'msg' : 'no power！'
		});
	}
}

// delete share
function del_share(id,res,session_this){
	if(session_this.power(7)){
		mongo.start({'collection_name':'share'},function(err,collection,close){
			collection.remove({id:id},function(err,docs){  
				if(err) {  
					console.log('ERROR');
				   res.end('{\'code\':2,\'msg\':\'maybe something wrong !\'}');        
				}else {
			      res.end('{\'code\':1,\'msg\':\'delete sucuss !\'}');
				}
				close();
			});
		});
	}else{
		response(res,{
			'code' : 2,
			'msg' : 'no power！'
		});
	}
}

// delete opus
function del_opus(id,res,session_this){
	if(session_this.power(10)){
		mongo.start({'collection_name':'opus'},function(err,collection,close){
			collection.remove({id:id},function(err,docs){  
				if(err) {  
					console.log('ERROR');
				    res.end('{\'code\':2,\'msg\':\'maybe something wrong !\'}');        
				}else {
			        res.end('{\'code\':1,\'msg\':\'delete sucuss !\'}');
				}
				close();
			});
		});
	}else{
		response(res,{
			'code' : 2,
			'msg' : 'no power！'
		});
	}
}

// delete user
function del_user(id,res,session_this){
	if(session_this.power(13)){
		mongo.start({'collection_name':'user'},function(err,collection,close){
			collection.remove({id:id},function(err,docs){
				if(err) {  
					console.log('ERROR');
					response(res,{
						'code' : 2,
						'msg' : 'maybe something wrong !'
					});   
				}else {
					response(res,{
						'code' : 1,
						'msg' : 'delete user sucuss !'
					});
				}
				close();
			});
		});
	}else{
		response(res,{
			'code' : 2,
			'msg' : 'no power！'
		});
	}
}

exports.render = function (req,res){
	var dataString = req.url.split('?')[1]||'',
		data = querystring.parse(dataString),
		from = data['from']||'',
		id = data['id']||'';
	
	if(from.length<2){
		response(res,{
			'code' : 2,
			'msg' : 'please input [from] for del !'
		});
	}else if(id.length<2){
		response(res,{
			'code' : 2,
			'msg' : 'please input [id] for del !'
		});
	}else{
		var session_this = session.start(req,res);
		
		switch(from){
			case 'blog' :
				del_blog(id,res,session_this);
				break;
			case 'share' :
				del_share(id,res,session_this);
				break
			case 'opus' :
				del_opus(id,res,session_this);
				break;
			case 'user' :
				del_user(id,res,session_this);
				break;
			default :
				response(res,{
					'code' : 2,
					'msg' : 'please check [from] in [blog/share/opus/user] !'
				});
		}
	}
}
