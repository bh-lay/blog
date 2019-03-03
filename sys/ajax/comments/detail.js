
var DB = require('../../core/DB.js')


//获取评论列表
module.exports = function(_id,callback){
	DB.getCollection('comments')
		.then(({collection, closeDBConnect}) => {
			collection.findOne({
				'_id': mongo.ObjectID(_id)
			},function(err, docs) {
				closeDBConnect()
				callback && callback(err,docs)
			})
		}).catch(err => {
			callback && callback(err)
		})
}