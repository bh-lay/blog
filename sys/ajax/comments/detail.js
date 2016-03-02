
var mongo = require('../../core/DB.js');


//获取评论列表
module.exports = function(_id,callback){
	var method = mongo.start();

	method.open({
		collection_name: 'comments'
	},function(err,collection){
		if(err){
			callback && callback(err);
			return;
		}

		collection.findOne({
			"_id": mongo.ObjectID(_id)
		},function(err, docs) {
			method.close();
			callback && callback(err,docs);
		});
	});
};