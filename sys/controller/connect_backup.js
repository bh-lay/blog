/**
 * @author bh-lay
 */
var https = require('https');
var querystring = require('querystring');
var mongo = require('../mod/DB');
var sina = require('../lib/sinaSDK.js');

function matchUser(param,callback){
	var from = param['from'] || 'weibo';
	var UID = param['UID'] || null;
	if(!UID){
		callback('where is UID ？',null);
	}

	var method = mongo.start();
	method.open({'collection_name':'SNSuser'},function(err,collection){
		collection.find({'from':from,'UID' : UID}).toArray(function(err, docs) {

			if(docs.length == 0){
		//创建一条用户
				collection.insert(param,function(err,result){
					method.close();
					var err = err || null;
					callback&&callback(err,result);
				});
			}else{
		//更新用户信息
				collection.update({'from':from,'UID' : UID}, {$set:param}, function(err,docs) {
					method.close();
					var err = err || null;
					callback&&callback(err,docs);
				});
			}
		});
	});
}
//从用户组中获取权限分配
function get_power(method,user_group,callback){
	method.open({'collection_name':'user_group'},function(err,collection){
		collection.find({'user_group':user_group}).toArray(function(err, docs) {
			var power_data = docs[0]['power'];
			callback&&callback(power_data);
		});
	});
}
//从本地用户库中获取用户信息
function getUserSession(id,callback){
	var method = mongo.start();

	method.open({'collection_name':'user'},function(err,collection){
		//
		collection.find({'id':id}).toArray(function(err, docs) {
			if(docs.length == 0){
				//用户不存在
				callback&&callback('userid is not exist !');
				return
			}
		
			var user_group = docs[0]['user_group'];
			var username = docs[0]['username'];
			var userid = docs[0]['id'];
			get_power(method,user_group,function(power_data){
				method.close();
				callback&&callback(null,{
					'user_group' : user_group,
					'username' : username, 
					'user_id' : userid,
					'power_data' : power_data
				});				
			});
		});
	});
}
//登录或注册页面
function loginOrRegister(res_this){
	res_this.json({'name':'loginOrRegister'});
}
function sina_oauth(){
	if(!code){
		res_this.json({
			'code' : 100,
			'msg' : 'wo he wo de xiao huo ban men dou jing dai le !'
		});
		return
	}
	//从新浪SDK获取token
	sina.get_token(code,function(err,this_json){
		if(err){
			console.log(err,this_json);
			res_this.json({
				'code' : 100,
				'msg' : 'cheng xu sha bi diao le !'
			});
			return
		}
		if(!this_json.uid){
			res_this.json({
				'code' : 100,
				'msg' : 'cheng xu shi ge da sha bi !'
			});
			return
		}
		//从新浪获取用户信息
		sina.userInfo({
			'access_token' : this_json['access_token'],
			'uid' : this_json['uid']
		},function(err,data){
			if(err){
				console.log(err,data);
				res_this.json({
					'code' : 100,
					'msg' : 'cheng xu sha bi diao le !'
				});
				return
			}
			var SNSuserid = data['id']
			var param = {
				'from' : 'sina',
				'UID' : SNSuserid,
				'screen_name' : data['screen_name'],
				'gender' : data['gender'],
				'token' : this_json['access_token']
			}
			//在SNSuser表中查找/增加该用户信息
			matchUser(param,function(err,userData){
				if(err){
					res_this.json({
						'code' : 100,
						'msg' : 'cheng xu sha bi diao le !'
					});
					console.log(err);
					return
				}
				if(userData.localUID){
					//已经关联本地用户
					getUserSession(userData.localUID,function(err,sessionData){
						if(err){
							res_this.json({
								'code' : 100,
								'msg' : 'cheng xu sha bi diao le !'
							});
							console.log(err);
							return
						}
						//设为已登录状态并跳转至首页
						session.start(req,res_this,function(){
							var session_this = this;
							session_this.set(sessionData);
							res_this.define(302,{
								'location' : '/'
							});
						});
					});
				}else{
					//未关联本地用户
					session.start(req,res_this,function(){
						var session_this = this;
						session_this.set({
							'SNSuserid' : SNSuserid
						});
						//登录或注册
						loginOrRegister(res_this);
					});
				}
			});
		});
	});
}

function github_oauth(req,res_this,path){
	
	res_this.json({
		'path' : 2345
	});
}
//对外接口
exports.deal = function (req,res_this,path){
	var code = path.search.code || null;
	if(path.pathnode.length == 2){
		if(path.pathnode[1] == 'sina'){
			sina_oauth(req,res_this,path);
		}else{
			github_oauth(req,res_this,path);
		}
	}else{
		res_this.json({
			'path' : path
		});
	}
};