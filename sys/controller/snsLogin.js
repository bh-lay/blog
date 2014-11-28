/**
 * @author bh-lay
 */
var github = require('../lib/githubSDK.js');
var DB = require('../core/DB.js');

function login(connect,user,callback){
	connect.session(function(session_this){
		var user_group = user['user_group'];
		
		DB.get_power(user_group,function(err,power_data){
			callback && callback(err)
			var userid = user['id'];
			session_this.set({
				'user_group' : user_group,
				'username' : user['username'], 
				'uid' : userid,
				'avatar' : '',
				'power_data' : power_data
			});
			callback && callback(null);
		});
	});
}
//对外接口
exports.github = function (connect,app){
	//定义返回页面方法
	function sendResult(data){
		//获取视图
		app.views('snsLogin',{
			'from' : 'github',
			'data' : JSON.stringify(data)
		},function(err,html){
			connect.write('html',200,html);
		});
	}

	var code = connect.url.search.code;
	if(!code){
		sendResult({
			'code' : 203,
			'msg' : 'missing code'
		});
		return
	}
	github.get_token(code,function(err,data){
		if(err){
			sendResult({
				'code' : 201,
				'msg' : '获取token失败',
			});
			return
		}
		
		github.userInfo({
			'access_token' : data.access_token
		},function(err,data){
			if(err){
				sendResult({
					'code' : 202,
					'msg' : '获取用户信息失败',
				});
				return
			}
			
			var method = DB.start();
			method.open({'collection_name':'user'},function(err,collection){
				if(err){
					sendResult({
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
							login(connect,usrInfo,function(err){
								if(err){
									sendResult({
										'code': 6,
										'msg':'创建用户成功，登陆失败！'
									});
									return
								}
								sendResult({
									'code': 200,
									'msg':'创建用户成功，且登陆成功！！',
									'user' : usrInfo
								});
							});
							
						});
					}else{
						//用户已存在
						login(connect,docs[0],function(err){
							if(err){
								sendResult({
									'code': 7,
									'msg':'登陆失败！'
								});
								return
							}
							sendResult({
								'code' : 200,
								'msg' : '登陆成功！',
								'user' : docs[0]
							});
						});
					}
				});
			});
		});
	});
};