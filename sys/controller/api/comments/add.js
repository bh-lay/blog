
var DB = require('../../../core/DB.js')
let showdown  = require('showdown')
// 评论最大字数
const maxCommentsTextLangth = 1000

const encodeHtml = s =>{
	/* eslint-disable no-control-regex */
	return (typeof s != 'string') ? s : s.replace(/<|>/g,function($0){
		var c = $0.charCodeAt(0), r = ['&#']
		c = (c == 0x20) ? 0xA0 : c
		r.push(c); r.push(';')
		return r.join('')
	})
}

function getUserInfo(id,callback){
	DB.getCollection('user')
		.then(({collection, client}) => {
			collection.find({'id' : id}).toArray(function(err, docs) {
				client.close()
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
		content : data.content.slice(0, maxCommentsTextLangth),
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
		.then(({collection, client}) => {
			collection.insertOne(item,function(err){
				if(err) {
					callback && callback(err)
				} else {

					// 内容由 markdown 转为 html
					let markdownConverter = new showdown.Converter()
					let content = encodeHtml(item.content)
					item.content = markdownConverter.makeHtml(content)
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
				client.close()
			})
		}).catch(err => {
			callback && callback(err)
		})
}