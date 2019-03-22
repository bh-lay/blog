
var DB = require('../../../core/DB.js')


// 获取评论详情
module.exports = function(_id,callback){
	DB.getCollection('comments')
		.then(({collection, client}) => {
			collection.findOne({
				'_id': DB.ObjectID(_id)
			},function(err, docs) {
				client.close()
				callback && callback(err,docs)
			})
		}).catch(err => {
			callback && callback(err)
		})
}