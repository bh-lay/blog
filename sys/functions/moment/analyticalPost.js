
// author bh-lay
var DB = require('../../core/DB')
exports.update = function (callback) {
	DB.getDB()
		.then(({client, db}) => {
			const postCollection = db.collection('moment_post')
			const analysisCollection = db.collection('analysis')
			let needUpdateCount = 0
			let updatedCount = 0
			const checkIsSuccess = () => {
				let isEnd = needUpdateCount === updatedCount
				if (isEnd) {
					client.close()
				}
				return isEnd
			}
			postCollection.find({}).forEach((err, doc) => {
				// 遍历结束，退出
				if (!doc) {
					return
				}
				if (err) {
					return
				}
				needUpdateCount++
				let target = doc.originalUrl
				analysisCollection.countDocuments({
					type:'redirect',
					params: {
						target
					}
				}, (err, count) => {
					if (err) {
						updatedCount++
						checkIsSuccess()
						return
					}
					postCollection.updateOne({
						_id: doc._id
					}, {
						$set: {
							analysis: {
								view: count
							}
						}
					}, function () {
						updatedCount++
						checkIsSuccess()
					})
				})
			})
		})
		.catch((error) => {
			console.log('error', error)
		})
}