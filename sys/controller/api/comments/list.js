
var DB = require('../../../core/DB.js')
let showdown  = require('showdown')
const encodeHtml = s =>{
	/* eslint-disable no-control-regex */
	return (typeof s != 'string') ? s : s.replace(/<|>/g,function($0){
		var c = $0.charCodeAt(0), r = ['&#']
		c = (c == 0x20) ? 0xA0 : c
		r.push(c); r.push(';')
		return r.join('')
	})
}
/**
 * 处理评论数据
 *  增加用户信息
 *
 **/
const makeUpUserInfo = (db, docs) => {
	
	let userIDList = []
	
	// 遍历评论列表
	docs.forEach(item => {
		// 获取所有需要的用户id
		if(item.uid && userIDList.indexOf(item.uid) === -1){
			userIDList.push(item.uid)
		}
		// 内容由 markdown 转为 html
		let markdownConverter = new showdown.Converter()
		let content = encodeHtml(item.content)
		item.content = markdownConverter.makeHtml(content)
	})
	// 挨个构建获取用户信息对象
	let userCollection = db.collection('user')
	let getUserInfoArray = userIDList.map(uid => {
		return new Promise((resolve) => {
			// 获取用户信息
			userCollection.findOne({
				id: uid
			}, (err, doc) => {
				resolve((err || !doc) ? {} : {
					avatar: doc.avatar,
					id: doc.id,
					username: doc.username
				})
			})
		})
	})
	// 统一等待获取
	return Promise.all(getUserInfoArray)
		.then(userList => {
			// 将获取到的用户列表转为 id 为 key 的对象
			let users = {}
			userList.forEach(item => {
				users[item.id] = item
			})
			// 处理用户信息字段
			docs.forEach(function(item){
				if (users[item.uid]) {
					item.user = users[item.uid]
				} else {
					item.user = item.user || {}
				}
			})

			return docs
		})
}

// 获取评论列表
module.exports = function(connect,data,callback){
	let limit_num = parseInt(data['limit']) || 10
	let skip_num = parseInt(data['skip']) || 0
	let getListForAdmin = !!data.isadmin

	DB.getDB().then(({client, db}) => {
		const collection = db.collection('comments')
		
		// 按照分页获取数据
		return DB.getDocsForPagination(collection, {
			params: {
				cid: data['cid']
			},
			limit: limit_num,
			skip: skip_num,
			sort: {
				time: -1
			}
		}).then(({count, docs}) => {
			// 是否为后台管理列表
			if(getListForAdmin){
				connect.session(session_this => {
					// 用不到数据库了，关闭连接
					client.close()
					if(session_this.get('user_group') === 'admin'){
						callback && callback(null,{
							count: count,
							list: docs
						})
					}else{
						// 权限验证
						callback && callback(null,{
							count: count,
							list: []
						})
					}
				})
			}else{
				// 普通列表
				// 补齐用户信息
				return makeUpUserInfo(db, docs).then(list => { 
					// 用不到数据库了，关闭连接
					client.close()
					callback && callback(null,{count, list})
				})
			}
		})
	}).catch(err => {
		callback && callback(err)
	})
}