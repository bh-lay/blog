
var mongo = require('../../core/DB.js');
var utils = require('../../core/utils/index.js');

//修改评论
module.exports = function(_id,data,callback){
	var method = mongo.start();
	method.open({
		collection_name: 'comments'
	},function(error,collection){

		collection.update({
			_id: mongo.ObjectID(_id)
		}, {
			$set: data
		}, function(err) {
			callback && callback(err);
			method.close();
		});
	});
};