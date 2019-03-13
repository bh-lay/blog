
var DB = require('../../../core/DB.js')

// 修改评论
module.exports = function(_id,data,callback){
	DB.getCollection('comments')
		.then(({collection, closeDBConnect}) => {
			collection.updateOne({
				_id: DB.ObjectID(_id)
			}, {
				$set: data
			}, function(err) {
				callback && callback(err)
				closeDBConnect()
			})
		}).catch(err => {
			callback && callback(err)
		})
}