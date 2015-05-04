
var mongo = require('../../core/DB.js');
var utils = require('../../core/utils/index.js');

function getUserInfo(id,callback){
	var method = mongo.start();
	method.open({'collection_name':'user'},function(err,collection){
		if(err){
			callback && callback(err);
			return;
		}
		collection.find({'id' : id}).toArray(function(err, docs) {
			method.close();
			if(err || docs.length == 0){
				callback && callback(err);
				return;
			}
			delete docs[0]['password'];
			callback && callback(null,docs[0]);
		});
	});
}
//增加一条评论
module.exports = function(data,callback){
	var item = {
		content : utils.encodeHtml(data.content),
		time : new Date().getTime(),
		cid : data.cid,
    reply_for_id : data.reply_for_id
	};
	if(!item.cid){
		callback && callback('missing argument : cid');
		return;
	}
	//登录用户只记id，本地用户记录对象
	if(data.uid){
		item.uid = data.uid;
	}else{
		item.user = data.user;
	}
	
	
	var method = mongo.start();
	method.open({
    collection_name: 'comments'
  },function(err,collection){
    if(err){
      callback && callback(err);
      return
    }
		collection.insert(item,function(err,result){
			if(err) {
				callback && callback(err);
			}else {
				if(data.uid){
					//获取用户信息
					getUserInfo(data.uid,function(err,userInfo){
						if(!err){
							item.user = userInfo;
						}
						callback && callback(null,item);
					});
				}else{
					callback && callback(null,item);
				}
			
			}
			method.close();
		});
	});
};