/*
 * @author bh-lay
 */
let DB = require('../../core/DB.js')
const collectionName = 'moment_cache'

// 获取缓存
const getCache = cacheName => {
	return DB.getCollection(collectionName)
		.then(({collection, client}) => {
			return new Promise((resolve, reject) => {
				collection.findOne({
					name: cacheName
				}, (err, doc) => {
					client.close()
					if (err || !doc) {
						reject(err)
					} else {
						resolve(doc)
					}
				})
			})
		})
}

// 设置缓存
const setCache = (cacheName, content) => {
	return DB.getDB().then(({client, db}) => {
		let collection = db.collection(collectionName)
		// 获取缓存名下的文档总数
		collection.countDocuments({
			name: cacheName
		}, (err, resultCount) => {
			if (err) {
				return
			}
			let isExist = resultCount > 0
			if (isExist) {
				// 存在，则更新缓存
				collection.updateOne({
					name: cacheName
				}, {
					$set: {
						content,
						updateTime: new Date().getTime()
					}
				}, () => {
					client.close()
				})
			} else {
				// 不存在，则插入一条
				collection.insertOne({
					name: cacheName,
					content,
					updateTime: new Date().getTime()
				}, () => {
					client.close()
				})
			}
		})
	})
}

exports.get = getCache
exports.save = setCache