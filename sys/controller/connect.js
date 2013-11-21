/**
 * @author bh-lay
 */
var https = require('https');
var querystring = require('querystring');
var mongo = require('../conf/mongo_connect');
var sina = require('../lib/sinaSDK.js');
var session = require('../mod/session');

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
				collection.update({'from':from,'UID' : UID}, {$set:param}, function(err,docs) {
					method.close();
					var err = err || null;
					callback&&callback(err,docs);
				});
			}			
		});
	});
}

exports.deal = function (req,res_this,path){
	var code = path.search.code || null;
	if(!code){
		res_this.json({
			'code' : 100,
			'msg' : 'wo he wo de xiao huo ban men dou jing dai le !'
		});
		return
	}
	
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
			var param = {
				'from' : 'sina',
				'UID' : data['id'],
				'screen_name' : data['screen_name'],
				'gender' : data['gender'],
				'token' : this_json['access_token']
			}
			matchUser(param,function(err,userData){
				session.start(req,res_this,function(){
					var session_this = this;
					session_this.set({
						'user_group' : 'admin',
						'username' : '剧中人-1', 
						'user_id' : "12345678987654345678",
						'power_data' : "00000000000000000000000000"
					});
					res_this.define(302,{
						'location' : '/admin'
					});
				});
			});
		});
	});
}