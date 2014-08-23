
var mongo = require('../../lofox/DB.js');
var parse = require('../../lofox/parse.js');

//增加一条评论
module.exports = function(data,callback){
	var item = {
		'content' : parse.encodeHtml(data.content),
		'time' : new Date().getTime(),
		'uid' : data.uid || null
	};
	var method = mongo.start();
	method.open({'collection_name':'comments'},function(err,collection){
		item.id = parse.createID();
		collection.insert(item,function(err,result){
			if(err) {
				callback && callback(err);
			}else {
				callback && callback(null,item);
			}
			method.close();
		});
	});
};