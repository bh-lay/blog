/*
 * @author bh-lay
 *
 *  首页部分代码片段
 */

var juicer = require('juicer');
var mongo = require('../mod/DB');

exports.produce = function(temp,data,callback){
	var method = mongo.start();
	method.open({'collection_name':'blog_friend'},function(err,collection){
		collection.find({}, {limit:20}).toArray(function(err, docs) {
			var html = juicer(temp,{'friend_list':docs});
			
			callback && callback(null,html);
			method.close();
		});
	});
};