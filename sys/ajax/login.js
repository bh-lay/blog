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

var powerList = {
	'admin' : [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	'editor' : [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	'test' : [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
}

function login (res_this,session_this,username,password){
	var username = username,
		password = password;
	var user_group = session_this.get('user_group');
	//matche user
	var method = mongo.start();
	method.open({'collection_name':'user'},function(err,collection){
		collection.find({'username':username,'password':password}).toArray(function(err, docs) {
			if(docs.length > 0){
				var user_group = docs[0]['user_group'];
				
		//		method.open({'collection_name':'user_group'},function(err,collection){
		//			collection.find({'user_group':user_group}).toArray(function(err, docs) {
		//				console.log(docs[0]['power']);
						method.close();
		//			});
		//		});
				
				
				session_this.set({
					'user_group' : user_group,
					'user_nick' : docs[0]['usernick'],
					'user_id' : docs[0]['id'],
					'power_data' : powerList[user_group]
				});
				
				res_this.json({
					'code':1,
					'msg':'login success!'
				});
			}else{
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
