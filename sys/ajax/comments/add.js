
var mongo = require('../../lofox/DB.js');
var parse = require('../../lofox/parse.js');

//增加一条评论
module.exports = function(data,callback){
	var item = {
		'content' : parse.encodeHtml(data.content),
		'time' : new Date().getTime(),
		'id' : data.id
	};
	if(!item.id){
		callback && callback('missing argument : id');
		return;
	}
	//登录用户只记id，本地用户记录对象
	if(data.uid){
		item.uid = data.uid;
	}else{
		item.user = data.user;
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