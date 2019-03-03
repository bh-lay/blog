
//author bh-lay
var DB = require('../core/DB')

exports.update = function (callback) {
	DB.getCollection('blog_friend')
		.then(({ collection, closeDBConnect }) => {
			collection.find({
				isShow: '1'
			}).toArray(function (err, docs) {
				if (err) {
					callback && callback(err)
					return
				}
				docs.forEach(function (item) {
					item = item || {}
					var hasGithub = item.github_username && item.github_username.length > 2 ? 1 : 0
					var hasCover = item.cover && item.cover.length > 10 ? 1 : 0
					var hasBlog = item.url && item.url.length > 10 ? 1 : 0
					var adminScore = parseInt(item.adminScore || 0)
					item.score = hasGithub * 4 + hasBlog * 3 + hasCover * 2 + adminScore
					collection.save(item, function () { })
				})
				closeDBConnect()

				callback && callback()
			})
		}).catch(err => {
			callback && callback(err)
		})
}