import DB from '@/core/DB'
import { routeItemMatched, Connect, App } from '@/core/types'
import { parseRequestBody } from '@/core/utils/parse'
import { encodeHtml } from '@/lib/utils'

let showdown  = require('showdown')
// 评论最大字数
const maxCommentsTextLangth = 1000

async function getUserInfo(id: string){
	const {collection, client} = await DB.getCollection('user')

	const docs = await collection.find({'id' : id}).toArray()
	client.close()
	if(docs.length === 0){
		return null
	}
	delete docs[0]['password']
	return docs[0]
}
// 增加一条评论
async function add(data: any){
	var item = {
		content : (data.content || '').slice(0, maxCommentsTextLangth),
		time : new Date().getTime(),
		cid : data.cid,
		reply_for_id : data.reply_for_id,
		uid: null,
		user: null
	}
	if(!item.cid){
		throw Error('missing argument : cid')
	}
	// 登录用户只记id，本地用户记录对象
	if(data.uid){
		item.uid = data.uid
	}else{
		item.user = data.user
	}
	
	const {collection, client} = await DB.getCollection('comments')
	await collection.insertOne(item)

	// 内容由 markdown 转为 html
	let markdownConverter = new showdown.Converter()
	let content = encodeHtml(item.content)
	item.content = markdownConverter.makeHtml(content)
	if(data.uid){
		// 获取用户信息
		const userInfo = await getUserInfo(data.uid)
		item.user = userInfo as null

	}
	client.close()
	return item
}

// 二分钟限制十个回复
let time_limit = 2 * 60 * 1000
let count_limit = 10

// 增加回复/评论
export default async function (route: routeItemMatched, connect: Connect, app: App){
	const { params } = await parseRequestBody(connect.request)

	if (!params || Object.keys(params).length === 0) {
		return connect.writeJson({
			code : 201
		})
	}
	const sessionInstance = await connect.session()
	// 检测认证信息
	var comment_auth = sessionInstance.get('comment_auth') as string
	if(comment_auth !== 'ready'){
		// 不是正常用户，阻止评论
		return connect.writeJson({
			code : 201
		})
	}
	// 获取评论计数
	var comment_count = sessionInstance.get('comment_count') as number || 0
	// 上次清除评论计数的时间
	var comment_last_clear_time = sessionInstance.get('comment_last_clear_time') as number || new Date().getTime() - time_limit * 2
	
	var now = new Date().getTime()
	// 时间间隔在限制之外
	if(now - comment_last_clear_time > time_limit){
		// 评论计数置为一
		sessionInstance.set({
			comment_count : 1,
			comment_last_clear_time : now
		})
	}else{
		// 指定时间内 评论数超过上限
		if(comment_count >= count_limit){
			return connect.writeJson({
				code : 403,
				msg : '评论频率过快，请歇息片刻！'
			})
		}else{
			// 评论计数加一
			sessionInstance.set({
				comment_count : comment_count + 1
			})
		}
	}

	// 清除所有评论缓存
	app.cache.clear('comment')

	params.uid = sessionInstance.get('uid')
	const data = await add(params)
	connect.writeJson({
		code : 200,
		data
	})
}