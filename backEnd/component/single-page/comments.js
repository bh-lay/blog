
var DB = require('../../core/DB.js')
var utils = require('../../core/utils/index.js')

function getUserInfo(id, callback) {
	DB.getCollection('user')
		.then(({ collection, client }) => {
			collection.find({ 'id': id }).toArray(function (err, docs) {
				client.close()
				if (err || docs.length == 0) {
					callback && callback(err)
					return
				}
				callback && callback(null, {
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
function handleData(docs, callback) {
	/**
	 * 统一调用回调
	 */
	function endFn() {
		// 处理用户信息字段
		docs.forEach(function (item) {
			if (users[item.uid]) {
				item.user = users[item.uid]
			} else if (item.user != null && typeof (item.user) == 'object') {
				delete item.user.email
			} else {
				item.user = {}
			}
		})
		callback && callback(docs)
	}

	var users = {}
	var uidsLength = 0
	var overLength = 0

	docs.forEach(function (item) {
		// 获取所有需要的用户id
		var uid = item.uid
		if (uid && !users[uid]) {
			users[uid] = {}
			uidsLength++
		}
		// 处理url
		if (item.cid == 'define-1') {
			item.url = '/bless' + '#comments-' + item._id
		} else {
			item.url = '/' + item.cid.replace(/-/g, '/') + '#comments-' + item._id
		}
		// 转换时间格式
		item.time = utils.parse.time(item.time, '{h}:{i} {m}-{d}')
	})
	if (uidsLength == 0) {
		endFn()
	} else {
		// 遍历所有需要的用户id
		for (var id in users) {
			// 获取单个用户信息
			getUserInfo(id, function (err, userInfo) {
				overLength++
				if (!err) {
					users[id] = userInfo
				}
				if (overLength >= uidsLength) {
					endFn()
				}
			})
		}
	}
}

// 获取最近评论
function getCommentList(callback) {
	DB.getCollection('comments')
		.then(({ collection, client }) => {
			collection.find({}, {
				limit: 8
			}).sort({ time: -1 }).toArray(function (err, docs) {
				client.close()

				handleData(docs, function (list) {
					callback && callback(err, list)
				})
			})
		}).catch(err => {
			callback && callback(err)
		})
}

exports.produce = function (temp, data, callback) {
	getCommentList(function (err, list) {
		var html = !err ? utils.juicer(temp, {
			list: list
		}) : ''
		callback && callback(err, html)
	})
}