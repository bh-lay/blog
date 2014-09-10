
var mongo = require('../../lofox/DB.js');
var parse = require('../../lofox/parse.js');

//增加一条评论
module.exports = function(data,callback){
	var item = {
		'content' : parse.encodeHtml(data.content),
		'time' : new Date().getTime(),
		'uid' : data.uid || null,
		'id' : data.id
	};
	if(!item.id){
		callback && callback('missing argument : id');
		return;
	}
	var method = mongo.start();
	method.open({'collection_name':'comments'},function(err,collection){
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