/**
 * @author bh-lay
 */
/*
@demo
-----------------------------------------------------------------
login: 									|		exist
	$.ajax({                      |       	$.ajax({
		'type':'GET',              |       		'type':'GET',
		'url':'/ajax/login',       |       		'url':'/ajax/login',
		'data':{                   |       		'data':{
			'user' : '',            |       			'act' : 'exist',
			'password' : '' ;       |       		},
		},                         |       	});
	});									|
-----------------------------------------------------------------
*/
var session = require('../mod/session');
var querystring = require('querystring');
var mongo = require('../conf/mongo_connect');

function get_power(method,user_group,callback){
	method.open({'collection_name':'user_group'},function(err,collection){
		collection.find({'user_group':user_group}).toArray(function(err, docs) {
			var power_data = docs[0]['power'];
			callback&&callback(power_data);
		});
	});
}

function login (res_this,session_this,username,password){
	var username = username,
		password = parse.md5(password);
	//matche user
	var method = mongo.start();

	method.open({'collection_name':'user'},function(err,collection){
		//
		collection.find({"$or": [{'username':username},{'email':username}]}).toArray(function(err, docs) {
			
			if(docs.length > 0){
				if( docs[0]['password'] != password){
					//密码错了
					res_this.json({
						'code':2,
						'msg':'二货，帐号密码输错了吧！'
					});
					return
				}
				
				var user_group = docs[0]['user_group'];
				get_power(method,user_group,function(power_data){
					method.close();
					session_this.set({
						'user_group' : user_group,
						'username' : docs[0]['username'], 
						'user_id' : docs[0]['id'],
						'power_data' : power_data
					});
					
					res_this.json({
						'code':1,
						'msg':'login success!'
					});
				});
				
			}else{
				//账号错了
				res_this.json({
					'code':2,
					'msg':'二货，帐号密码输错了吧！'
				});
			}
		});
	});
}
exports.render = function (req,res_this){

	session.start(req,res_this,function(){
		var session_this = this;
		var search = req.url.split('?')[1]||'';
		var data = querystring.parse(search);
		//exist
		if (data['act']=='exist'){
			session_this.set({
				'user_group' : 'guest',
				'power_data' : []
			});
			res_this.json({
				'code':1,
				'msg':'exist success !'
			});
		}else{
		//login
			var username = data['username'];
			var password = data['password'];
			if(!username||!password){
				res_this.json({
					'code':2,
					'msg':'please input username and password !'
				});
			}else{
				login(res_this,session_this,username,password)
			}
		}
	});
}
