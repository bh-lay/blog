
var DB = require('../../../core/DB.js')
var utils = require('../../../core/utils/index.js')

function getUserInfo(id,callback){
	DB.getCollection('user')
		.then(({collection, closeDBConnect}) => {
			collection.find({'id' : id}).toArray(function(err, docs) {
				closeDBConnect()
				if(err || docs.length == 0){
					callback && callback(err)
					return
				}
				delete docs[0]['password']
				callback && callback(null,docs[0])
			})
		}).catch(err => {
			callback && callback(err)
		})
}
// 增加一条评论
module.exports = function(data,callback){
	var item = {
		content : utils.encodeHtml(data.content),
		time : new Date().getTime(),
		cid : data.cid,
		reply_for_id : data.reply_for_id
	}
	if(!item.cid){
		callback && callback('missing argument : cid')
		return
	}
	// 登录用户只记id，本地用户记录对象
	if(data.uid){
		item.uid = data.uid
	}else{
		item.user = data.user
	}
	
	DB.getCollection('comments')
		.then(({collection, closeDBConnect}) => {
			collection.insertOne(item,function(err){
				if(err) {
					callback && callback(err)
				} else {
					if(data.uid){
						// 获取用户信息
						getUserInfo(data.uid,function(err,userInfo){
							if(!err){
								item.user = userInfo
							}
							callback && callback(null,item)
						})
					}else{
						callback && callback(null,item)
					}
				
				}
				closeDBConnect()
			})
		}).catch(err => {
			callback && callback(err)
		})
}