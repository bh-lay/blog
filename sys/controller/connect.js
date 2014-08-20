/**
 * @author bh-lay
 */
var github = require('../lib/githubSDK.js');
var mongo = require('../mod/DB');
var session = require('../mod/session');
var DB = require('../mod/DB');

function login(request,res_this,user,callback){
	session.start(request,res_this,function(){
		var session_this = this;
		var user_group = user['user_group'];
		
		DB.get_power(user_group,function(power_data){
		
			var userid = user['id'];
			session_this.set({
				'user_group' : user_group,
				'username' : user['username'], 
				'user_id' : userid,
				'avatar' : '',
				'power_data' : power_data
			});
			callback && callback(null)
		});
	});
}


function github_oauth(req,res_this,path){
	if(!path.search.code){
		return
	}
	var code = path.search.code;
	github.get_token(code,function(err,data){
		if(err){
			res_this.json({
				'code' : 201,
				'msg' : '获取token失败',
			});
			return
		}
		
		github.userInfo({
			'access_token' : data.access_token
		},function(err,data){
			if(err){
				res_this.json({
					'code' : 202,
					'msg' : '获取用户信息失败',
				});
				return
			}
			
		//	res_this.json({
	//			'err' : err,
	//			'data' : data
		//	});
			
			var method = mongo.start();
			method.open({'collection_name':'user'},function(err,collection){
				if(err){
					res_this.json({
						'code':4,
						'msg':'咱数据库被拐跑了！'
					});
					return
				}
				
				collection.find({'github_id':data.id}).toArray(function(err, docs) {
					if(docs.length == 0){
						//新用户
						var usrInfo = {
							'username' : data.name,
							'email' : data.email || null,
							'user_group' : 'user',
							'github_id' : data.id
						};
						DB.add_user(usrInfo,function(err,id){
							if(err){
								res_this.json({
									'code':5,
									'msg':'创建用户失败！'
								});
								return
							}
							usrInfo.id = id;
							login(req,res_this,usrInfo,function(err){
								if(err){
									res_this.json({
										'code': 6,
										'msg':'创建用户成功，登陆失败！'
									});
									return
								}
								res_this.json({
									'code': 1,
									'msg':'创建用户成功，且登陆成功！！'
								});
							});
							
						});
					}else{
						//用户已存在
						login(req,res_this,docs[0],function(err){
							if(err){
								res_this.json({
									'code': 7,
									'msg':'登陆失败！'
								});
								return
							}
							res_this.json({
								'code': 1,
								'msg':'登陆成功！'
							});
						});
					}
				});
			});
		});
	});
}
//对外接口
exports.deal = function (req,res_this,path){
	var code = path.search.code || null;
	if(path.pathnode.length == 2){
		if(path.pathnode[1] == 'sina'){
			res_this.json({
				'path' : path
			});
		}else{
			github_oauth(req,res_this,path);
		}
	}else{
		res_this.json({
			'path' : path
		});
	}
};