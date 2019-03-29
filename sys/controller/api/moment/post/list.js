
/*
 * @author bh-lay
 */

let DB = require('../../../../core/DB.js')
/**
 * 处理评论数据
 *  增加用户信息
 *
 **/
const makeUpUserInfo = (db, docs) => {
	
	let userIDList = []
	// 挨个构建获取用户信息对象
	let userCollection = db.collection('friends')
	// 遍历评论列表
	docs.forEach(item => {
		// 获取所有需要的用户id
		if(item.userid && userIDList.indexOf(item.userid) === -1){
			userIDList.push(item.userid)
		}
	})
	let getUserInfoArray = userIDList.map(userid => {
		return new Promise((resolve) => {
			// 获取用户信息
			userCollection.findOne({
				id: userid
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
			console.log('userList', userList)
			// 将获取到的用户列表转为 id 为 key 的对象
			let users = {}
			userList.forEach(item => {
				users[item.id] = item
			})
			// 处理用户信息字段
			docs.forEach(function(item){
				if (users[item.userid]) {
					item.user = users[item.userid]
				} else {
					item.user = item.user || {}
				}
			})

			return docs
		})
}
module.exports = function get_list(data, callback) {
	let limit_num = parseInt(data['limit']) || 10
	let skip_num = parseInt(data['skip']) || 0
	let params = {}

	// 过滤标签
	if(data.tag){
		params.tags = data.tag
	}
	
	// 按照分页获取数据
	return DB.getDB().then(({client, db}) => {
		const collection = db.collection('moment')
		DB.getDocsForPagination(collection, {
			params,
			limit: limit_num,
			skip: skip_num,
			sort: {
				time_show: -1
			}
		})
			.then(({count, docs}) => {
				makeUpUserInfo(db, docs)
					.then(() => {
						client.close()
						callback && callback({
							code: 1,
							limit: limit_num,
							skip: skip_num,
							count,
							list: docs
						})
					})
			}).catch(() => {
				callback && callback({
					code: 2
				})
			})
	})
  
}