/*
 * @author bh-lay
 *
 *  首页部分代码片段
 */

var mongo = require('../conf/mongo_connect');
var juicer = require('juicer');
var showdown = require('../lib/showdown/showdown.js');
var converter = new showdown.converter();

exports.produce = function(temp,data,callback){
	var method = mongo.start();
	var id = data.id;
	method.open({'collection_name':'article'},function(err,collection){

		collection.find({id:id}).toArray(function(err, docs) {
			method.close();
			if(arguments[1].length==0){
				callback && callback('哇塞，貌似这篇博文不存在哦!');
			}else{
				docs[0].time_show = parse.time(docs[0].time_show ,'{y}-{m}-{d}');
			//	docs[0].content = markdown.parse(docs[0].content);
				docs[0].content = converter.makeHtml(docs[0].content);
				var txt = juicer(temp,docs[0]);
			//	callback&&callback(docs[0].content);
				callback&&callback(null,txt,docs[0]);
			}
		});
	});
};