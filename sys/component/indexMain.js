/*
 * @author bh-lay
 *
 *  首页部分代码片段
 */

var utils = require('../core/utils/index.js');
var mongo = require('../core/DB');

exports.produce = function(temp,data,callback){
	var method = mongo.start();
	method.open({'collection_name':'blog_friend'},function(err,collection){
		collection.find({}, {limit:20}).toArray(function(err, docs) {
			if(err){
				callback && callback(err);
				return
			}
			console.log(temp, docs);
			var html = utils.juicer(temp,{
				'list': docs
			});
			
			callback && callback(null,html);
			method.close();
		});
	});
};