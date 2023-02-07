
// author bh-lay
var DB = require('../../core/DB')
let analysis = require('../analysis/index.js')
const countScore = item => {
	let hasGithub = item.github_username && item.github_username.length > 2 ? 1 : 0
	let hasCover = item.cover && item.cover.length > 10 ? 1 : 0
	let hasBlog = item.url && item.url.length > 10 ? 1 : 0
	let adminScore = parseInt(item.adminScore || 0)
	return hasGithub * 4 + hasBlog * 3 + hasCover * 2 + adminScore
}
const countPost = userid => {
	return new Promise((resolve) => {
		DB.getCollection('moment_post')
			.then(({collection, client}) => {
				collection.countDocuments({
					userid
				}, (err, count) => { 
					resolve(count || 0)
				})
			})
			.catch(() => {
				resolve(0)
			})
	})
}
exports.update = function (callback) {
	DB.getDB()
		.then(({client, db}) => {
			const friendCollection = db.collection('friends')
			let needUpdateCount = 0
			let updatedCount = 0
			const checkIsSuccess = () => {
				let isEnd = needUpdateCount === updatedCount
				if (isEnd) {
					client.close()
				}
				return isEnd
			}
			friendCollection.find({}).forEach(doc => {
				let score = countScore(doc)
				
				let userid = doc.id
				countPost(userid).then(postCount => {
					friendCollection.updateOne({
						_id: doc._id
					}, {
						$set: {
							score,
							analysis: {
								postCount
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