/**
 * @author bh-lay
 *
 */

var DB = require('../../../../core/DB.js')

function getTagsList(callback) {
	DB.getCollection('moment')
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
					return y.count - x.count
				})
				callback && callback(null, tagsArray)
			})
		}).catch(err => {
			callback && callback(err)
		})
}
module.exports = getTagsList
