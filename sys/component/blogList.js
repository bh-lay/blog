/*
 * @author bh-lay
 *
 *  首页部分代码片段
 */

var juicer = require('juicer');
var mongo = require('../conf/mongo_connect');
var juicer = require('juicer');

exports.produce = function(temp,data,callback){
	var method = mongo.start();
	method.open({'collection_name':'article'},function(err,collection){
		collection.find({}, {limit:10}).sort({id:-1}).toArray(function(err, docs) {
			method.close();
			for(var i in docs){
				docs[i].time_show = parse.time(docs[i].time_show ,'{y}-{m}-{d}');
			}
			var html = juicer(temp,{'list' : docs});
			callback && callback(null,html);
		});
	});
};