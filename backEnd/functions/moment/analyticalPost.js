
// author bh-lay
var DB = require('../../core/DB')
let analysis = require('../analysis/index.js')
exports.update = function (callback) {
	DB.getDB()
		.then(({client, db}) => {
			const postCollection = db.collection('moment_post')
			let needUpdateCount = 0
			let updatedCount = 0
			const checkIsSuccess = () => {
				let isEnd = needUpdateCount === updatedCount
				if (isEnd) {
					client.close()
				}
				return isEnd
			}
			postCollection.find({}).forEach(doc => {
				let target = doc.originalUrl
				analysis.count({
					type:'redirect',
					params: {
						target
					}
				})
					.then(result => {
						postCollection.updateOne({
							_id: doc._id
						}, {
							$set: {
								analysis: {
									pv: result.pv
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