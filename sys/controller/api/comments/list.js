
var DB = require('../../../core/DB.js')
let showdown  = require('showdown')

function getUserInfo(id,callback){
	DB.getCollection('user')
		.then(({collection, client}) => {
			collection.find({
				id: id
			}).toArray(function(err, docs) {
				client.close()
				if(err || docs.length == 0){
					callback && callback(err)
					return
				}
				callback && callback(null,{
					avatar: docs[0].avatar,
					id: docs[0].id,
					username: docs[0].username
				})
			})
		}).catch(err => {
			callback && callback(err)
		})
}

/**
 * 处理评论数据
 *  增加用户信息
 *
 **/
function handleData(docs,callback){
	/**
	 * 统一调用回调
	 */
	function endFn(){
		// 处理用户信息字段
		docs.forEach(function(item){
			if(users[item.uid]){
				item.user = users[item.uid]
			}else if(item.user != null && typeof(item.user) == 'object'){
				delete item.user.email
			}else{
				item.user = {}
			}
		})
		callback&&callback(docs)
	}
	
	var users = {}
	var uidsLength = 0
	var overLength = 0
	
	// 获取所有需要的用户id
	docs.forEach(item => {
		var uid = item.uid
		if(uid && !users[uid]){
			users[uid] = {}
			uidsLength++
		}
		var markdownConverter = new showdown.Converter()
		item.content = markdownConverter.makeHtml(item.content)
	})
	if(uidsLength == 0){
		endFn()
	}else{
		// 遍历所有需要的用户id
		for(var id in users){
			// 获取单个用户信息
			getUserInfo(id,function(err,userInfo){
				overLength++
				if(!err){
					users[id] = userInfo
				}
				if(overLength >= uidsLength){
					endFn()
				}
			})
		}
	}
}

// 获取评论列表
module.exports = function(connect,data,callback){
	let limit_num = parseInt(data['limit']) || 10
	let skip_num = parseInt(data['skip']) || 0

	DB.getCollection('comments')
		.then(({collection, client}) => {
			var queryObj = {}
			if(data['cid'] && data['cid'].length > 1){
				queryObj.cid = data['cid']
			}
			collection.find(queryObj,{
				limit:limit_num
			}).sort({
				time:-1
			}).skip(skip_num).toArray(function(err, docs) {
				if(err){
					callback&&callback(err)
					return
				}
				// count the all list
				collection.countDocuments(queryObj,function(err,count){
					client.close()
					if(err){
						callback&&callback(err)
					}else{
						// 是否为后台管理列表
						if(data.isadmin){
							connect.session(function(session_this){
								if(session_this.get('user_group') == 'admin'){
									callback&&callback(null,{
										count: count,
										list: docs
									})
								}else{
									// 权限验证
									callback&&callback(null,{
										count: count,
										list: []
									})
								}
							})
						}else{
							// 普通列表
							handleData(docs,function(list){
								callback&&callback(err,{
									'count': count,
									'list': list
								})
							})
						}
					}
				})
			})
		}).catch(err => {
			callback && callback(err)
		})
}