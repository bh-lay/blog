/**
 * @author bh-lay
 *
 */

var DB = require('../core/DB.js')

const getTagsList = (DBClient) => {
	let collection = DBClient.collection('moment')
	return new Promise((resolve, reject) => {
		collection.find().toArray(function (err, docs) {
			if (err) {
				reject(err)
				return
			}
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
			resolve(tagsArray)
		})
	})
}
const addOrUpdateTag = (collection, {name, count}) => {
	collection.countDocuments({
		name
	}, (err, resultCount) => {
		console.log(name, 'resultCount', resultCount)
		if (err) {
			return
		}
		let isExist = resultCount > 0
		if (isExist) {
			collection.updateOne({ name }, {
				$set: { count }
			})
		} else {
			collection.insertOne({
				name,
				count,
				desc: '',
				createTime: new Date().getTime()
			})
		}
	})
}
module.exports = () => {
	DB.getDB().then(({client, db}) => {
		getTagsList(db).then(tagsArray => {
			if (tagsArray.length === 0) {
				return
			}
			let tagCollection = db.collection('moment_tag')
			tagsArray.forEach(tag => {
				console.log('tag', tag)
				addOrUpdateTag(tagCollection, tag)
			});
			// 延后十秒关闭连接
			setTimeout(() => {
				client.close()
			}, 10 * 1000)
		})

	});
}
