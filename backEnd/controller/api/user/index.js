/**
 * @author bh-lay
 * 
 * /ajax/user
 * /ajax/user/signup
 * /ajax/user/login
 * /ajax/user/list
 * demo $.post('/ajax/user',{
	
	});
 */

var mongo = require('../../../core/DB.js')
const DB = mongo
var utils = require('../../../core/utils/index.js')
// 增加一条用户记录
function add(parm,callback){
	parm = parm || {}
	DB.getCollection('user')
		.then(({collection, client}) => {
			parm.id = utils.createID()

			collection.insertOne(parm,function(err){
				if(err) {
					callback && callback(err)
				}else {
					callback && callback(null)
				}
				client.close()
			})
		}).catch(err => {
			callback && callback(err)
		})
}
// 修改用户记录
function edit(parm,callback){
	DB.getCollection('user')
		.then(({collection, client}) => {
			collection.updateOne({
				id : parm.id
			}, {
				$set: parm
			}, function(err) {
				if(err) {
					callback && callback(err)
				}else {
					callback && callback(null)
				}
				client.close()
			})
		}).catch(err => {
			callback && callback(err)
		})
}

/**
 * 获取用户列表
 * 
 */
function get_list(data,callback){
	var limit_num = parseInt(data['limit']) || 10,
		skip_num = parseInt(data['skip'])|| 0
	
	var resJSON = {
		'code':200,
		'limit':limit_num,
		'skip':skip_num,
	}
	DB.getCollection('user')
		.then(({collection, client}) => {
			collection.countDocuments(function(err,count){
				resJSON['count'] = count
				
				collection.find({},{
					limit:limit_num
				}).sort({
					id: -1
				}).skip(skip_num).toArray(function(err, docs) {
					client.close()
					if(err){
						resJSON.code = 2
					}else{
						for(var i=0,total=docs.length;i<total;i++){
							delete docs[i].password
						}
						resJSON['list'] = docs
					}
					callback&&callback(resJSON)
				})
			})
		}).catch(err => {
			callback && callback(err)
		})
}

function get_power(user_group,callback){
	DB.getCollection('user_group')
		.then(({collection, client}) => {
			collection.find({'user_group':user_group}).toArray(function(err, docs) {
				client.close()
				var power_data = docs[0]['power']
				callback&&callback(power_data)
			})
		}).catch(err => {
			callback && callback(err)
		})
}
// 处理login
function login_handle(connect,session_this,username,password){
	// matche user
	DB.getCollection('user')
		.then(({collection, client}) => {

			collection.find({
				email: username,
				password: password
			}).toArray(function(err, docs) {
				if(docs.length > 0){
					var user = docs[0]
					var user_group = user['user_group']
					get_power(user_group,function(power_data){
						client.close()
						var userid = user['id']
						session_this.set({
							user_group : user_group,
							username : user['username'], 
							uid : userid,
							power_data : power_data
						})
						if(user.password){
							delete user.password
						}
						
						connect.write('json',{
							code: 200,
							user: user
						})
					})
				}else{
					// 账号or密码 错了
					connect.write('json',{
						code: 2,
						msg: '二货，帐号密码输错了吧！'
					})
				}
			})
		}).catch(() => {
			connect.write('json',{
				code: 4,
				msg: '咱数据库被拐跑了！'
			})
		})
}


// 增加或编辑用户记录
exports.add_edit = function (connect){
	utils.parse.request(connect.request,function(error, fields){
		var data = fields
		var parm = {
			'id' : data['id'] || '',
			'username' : data['username'] || '',
			'password' : data['password'] ? utils.parse.md5(data['password']) : null,
			'email' : data['email'] || null,
			'avatar' : data['avatar'] || null,
			'user_group' : data['user_group'] || '',
		}
		if(!parm['username']){
			connect.write('json',{
				'code' : 2,
				'msg' : 'please insert complete code !'
			})
			return
		}
		
		connect.session(function(session_this){
			if(parm['id']&&parm['id'].length>2){
				// check edit user power
				if(session_this.power(12)){
					if(parm['password'] == null){
						delete parm['password']
					}
					edit(parm,function(err){
						if(err){
							connect.write('json',{
								'code':3,
								'msg':'modified faild!'
							})
							return
						}
						connect.write('json',{
							'code':1,
							'msg':'modified success!'
						})
					})
				}else{
					connect.write('json',{
						'code':2,
						'msg':'no power to edit user !'
					})
				}
			}else{
				// check add user power
				if(session_this.power(11)){
					add(parm,function(err){
						if(err){
							connect.write('json',{
								'code':3,
								'msg':'add faild!'
							})
							return
						}
						connect.write('json',{
							'code':1,
							'msg':'add success!'
						})
					})
				}else{
					connect.write('json',{
						'code':2,
						'msg':'no power to edit user !'
					})
				}
			}
		})
	})
}

/**
 * 登录
 * 限制五分钟登录五次
 **/
var time_limit = 5 * 60 * 1000
var count_limit = 5
exports.login = function (connect){
  
	var req = connect.request
	// 登录限定为 POST 方法
	if(req.method != 'POST'){
		connect.write('json',{
			code : 201,
			msg : 'please use POST to login !'
		})
		return
	}
	// 开启 session 功能
	connect.session(function(session_this){
		// 检测认证信息
		if(session_this.get('loginAuth') != 'ready'){
			// 不是正常用户，阻止登录
			connect.write('json',{
				code : 201,
				msg : '认证过期，请刷新重试！'
			})
			return
		}
    
		// 获取登录计数
		var login_count = session_this.get('login_count') || 0,
			// 上次清除登录计数的时间
			login_last_clear_time = session_this.get('login_last_clear_time') || new Date().getTime() - time_limit * 2,
			// 当前时间
			now = new Date().getTime()
    
		// 时间间隔在限制之外
		if(now - login_last_clear_time > time_limit){
			// 登录计数置为一
			session_this.set({
				login_count : 1,
				login_last_clear_time : now
			})
		}else{
			// 指定时间内 登录次数超过上限，停止处理登录请求
			if(login_count >= count_limit){
				connect.write('json',{
					code : 403,
					msg : '回家去吧，求你了！'
				})
				return
			}else{
				// 允许登录，登录计数加一
				session_this.set({
					login_count : login_count + 1
				})
			}
		}
		// 获取请求参数
		utils.parse.request(req,function(error,data){
			var email = data['email']
			var password = utils.parse.md5(data['password'] || '')
			if(!email || password.length < 2){
				connect.write('json',{
					code: 2,
					msg: 'please input email and password !'
				})
			}else{
				login_handle(connect,session_this,email,password)
			}
		})
	})
}

// 登出
exports.exist = function(connect){
	
	connect.session(function(session_this){
		session_this.set({
			user_group : 'guest',
			uid : '',
			power_data : []
		})
		connect.write('json',{
			code: 200,
			msg : 'exist success !'
		})
	})
}

// 获取用户列表
exports.list = function(connect){
	utils.parse.request(connect.request,function(err,data){
		if(err){
			connect.write('json',{
				'code' : 2,
				'msg' : ''
			})
			return
		}
		get_list(data,function(json){
			connect.write('json',json)
		})
	})
}
/**
 * 获取用户信息
 */
function getUserDetail(userID, callback){
	DB.getCollection('user')
		.then(({collection, client}) => {
			collection.find({
				id: userID
			}).toArray(function(err, docs) {
				client.close()
				if(err || docs.length == 0){
					callback && callback(err || 'error')
					return
				}
				var item = docs[0]
				if(item && item['password']){
					delete item['password']
				}
				callback&& callback(null,item)
			})
		}).catch(err => {
			callback && callback(err)
		})
}
// 获取用户信息
exports.detail = function (connect){
	utils.parse.request(connect.request,function(err,data){
		if(err){
			connect.write('json',{
				'code' : 201,
				'msg' : err
			})
			return
		}
		// 获取指定用户信息
		if(data.uid){
			getUserDetail(data.uid,function(err,detail){
				if(err){
					connect.write('json',{
						'code' : 201
					})
					return
				}
				connect.write('json',{
					'code' : 200,
					'detail' : detail
				})
			})
		}else{
		// 获取自己的用户信息
			connect.session(function(session_this){
				// session存入comment预留信息
				session_this.set({
					comment_auth : 'ready',
					loginAuth : 'ready'
				})
				
				var uid = session_this.get('uid')
				if (!uid) {
					connect.write('json',{
						'code' : 201
					})
					return
				}
				getUserDetail(uid,function(err,detail){
					if(err){
						connect.write('json',{
							'code' : 201
						})
						return
					}
					connect.write('json',{
						'code' : 200,
						'detail' : detail
					})
				})
			})
		}
	})
}
