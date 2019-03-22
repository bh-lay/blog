/**
 * @author bh-lay
 *
 */

var DB = require('../core/DB.js')

function getTagsList(callback) {
	DB.getCollection('article')
		.then(({ collection, client }) => {
			collection.find().toArray(function (err, docs) {
				client.close()

				var tagsObj = {}
				var tagsArray = []
				// 获取所有标签
				for (var i = 0, total = docs.length; i < total; i++) {
					var this_tags = docs[i].tags
					if (Object.prototype.toString.call(this_tags) == '[object Array]') {
						for (var s = 0, count = this_tags.length; s < count; s++) {
							var tagStr = this_tags[s]
							tagsObj[tagStr] = tagsObj[tagStr] ? tagsObj[tagStr] + 1 : 1
						}
					}
				}
				// 转换为数组
				for (var k in tagsObj) {
					tagsArray.push({
						name: k,
						count: tagsObj[k]
					})
				}
				// 排序
				tagsArray.sort(function (x, y) {
					if (x.count > y.count) {
						return -1
					} else {
						return 1
					}
				})
				callback && callback(null, tagsArray)
			})
		}).catch(err => {
			callback && callback(err)
		})
}

function getAllBlogTagsList(callback) {
	DB.getCollection('article')
		.then(({collection, client}) => {
			collection.find().toArray(function (err, docs) {
				client.close()
				if (err) {
					callback && callback(err)
					return
				}
				var tags = []
				for (var i = 0, total = docs.length; i < total; i++) {
					tags.push({
						id: docs[i].id,
						title: docs[i].title,
						tag: docs[i].tags
					})
				}
				callback && callback(null, tags)
			})
		}).catch(err => {
			callback && callback(err)
		})
}

// 获取所有博文的标签
exports.getAllBlogTagsList = getAllBlogTagsList
exports.getTagsList = getTagsList
