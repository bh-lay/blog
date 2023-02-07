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

let utils = require('../../../core/utils/index.js')
let power = require('../../../conf/power.js')
let add = require('./add.js')
let edit = require('./edit.js')
let list = require('./list.js')
let del = require('./del.js')
let detail = require('./detail.js')
// 二分钟限制十个回复
let time_limit = 2 * 60 * 1000
let count_limit = 10

// 增加回复/评论
exports.post = function (route, connect,app){
	utils.parse.request(connect.request,function(err,data){
		connect.session(function(session_this){
			// 检测认证信息
			var comment_auth = session_this.get('comment_auth')
			if(comment_auth != 'ready'){
				// 不是正常用户，阻止评论
				connect.write('json',{
					'code' : 201
				})
				return
			}
			// 获取评论计数
			var comment_count = session_this.get('comment_count') || 0
			// 上次清除评论计数的时间
			var comment_last_clear_time = session_this.get('comment_last_clear_time') || new Date().getTime() - time_limit * 2
      
			var now = new Date().getTime()
			// 时间间隔在限制之外
			if(now - comment_last_clear_time > time_limit){
				// 评论计数置为一
				session_this.set({
					'comment_count' : 1,
					'comment_last_clear_time' : now
				})
			}else{
				// 指定时间内 评论数超过上限
				if(comment_count >= count_limit){
					connect.write('json',{
						'code' : 403,
						'msg' : '评论频率过快，请歇息片刻！'
					})
					return
				}else{
					// 评论计数加一
					session_this.set({
						'comment_count' : comment_count + 1
					})
				}
			}
      
			// 清除所有评论缓存
			app.cache.clear('comment')
            
			data.uid = session_this.get('uid')
			add(data,function(err,data){
				var json = {
					'code' : 200
				}
				if(err){
					json.code = 500
				}else{
					json.data = data
				}
				connect.write('json',json)
			})
		})
	})
}

// 获取列表
exports.list = function (route, connect,app){
	var url = connect.request.url
	var data = connect.url.search

	// 使用缓存
	app.cache.use(url,['ajax','comment'],function(this_cache){
		connect.write('json',this_cache)
	},function(save_cache){
		list(connect,data,function(err,jsonData){
			var json = {
				code : 200
			}
			if(err){
				json.code = 500
			}else{
				json.data = jsonData
			}
			save_cache(JSON.stringify(json))
		})
	})
}

// 获取评论详情
exports.get = function (route, connect){
	let _id = route.params.id
	let json = {
		code : 200
	}

	if(!_id || _id.length < 2){
		json.code = 500
		connect.write('json',json)
		return
	}
	detail(_id,function(err,commentItem){
		var json = {
			code : 200
		}
		if(err){
			json.code = 500
		}else{
			json.detail = commentItem
		}
		connect.write('json',json)
	})
}
// 删除
exports.delete = function (route, connect,app){
	let ID = route.params.id
	if(ID.length<2){
		connect.write('json',{
			'code' : 2,
			'msg' : 'please input [id] for del !'
		})
	}else{
		connect.session(function(session_this){
			// 校验权限
			if(session_this.power(power.COMMENTS_DELETE)){
				del(ID,function(err){
					if(err){
						connect.write('json',{
							'code' : 500
						})
					}else{
						connect.write('json',{
							'code' : 200
						})
						// 清除所有缓存
						app.cache.clear('comment')
					}
				})
			}else{
				connect.write('json',{
					'code' : 201
				})
			}
		})
	}
}

exports.put = function(route, connect,app){
	utils.parse.request(connect.request,function(err,data){
		let _id = route.params.id
		connect.session(function(session_this){
			// 校验权限
			if(session_this.power(power.COMMENTS_EDIT)){
				edit(_id, data,function(err){
					if(err){
						connect.write('json',{
							'code' : 300,
							'msg' : '编辑失败'
						})
					}else{
						connect.write('json',{
							'code' : 200
						})
            
						// 清除所有评论缓存
						app.cache.clear('comment')
					}
				})
			}else{
				connect.write('json',{
					'code' : 201
				})
			}
		})
	})
}
