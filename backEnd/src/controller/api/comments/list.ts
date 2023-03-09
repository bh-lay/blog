import DB from '@/database/DB'
import * as mongodb from 'mongodb'
import { routeItemMatched, Connect, App } from '@/core/index'
import { encodeHtml } from '@/lib/utils'
const showdown  = require('showdown')

/**
 * 处理评论数据
 *  增加用户信息
 *
 **/
const makeUpUserInfo = async (db: mongodb.Db, docs: mongodb.Document[], format: string) => {
	
	const userIDList: string[] = []
	
	// 遍历评论列表
	docs.forEach(item => {
		// 获取所有需要的用户id
		if(item.uid && userIDList.indexOf(item.uid) === -1){
			userIDList.push(item.uid)
		}
		// 内容由 markdown 转为 html
		if (format === 'html') {
			const markdownConverter = new showdown.Converter()
			const content = encodeHtml(item.content)
			item.content = markdownConverter.makeHtml(content)
		}
	})
	// 构建获取用户信息对象
	const userCollection = db.collection('user')
	const userList = await userCollection.find({
		id: {
			$in: userIDList
		}
	}).toArray()
	// 将获取到的用户列表转为 id 为 key 的对象
	const users: Record<string, unknown> = {}
	userList.forEach(item => {
		users[item.id] = item
	})
	// 处理用户信息字段
	docs.forEach(function(item){
		if (users[item.uid]) {
			item.user = users[item.uid]
		} else {
			item.user = item.user || {}
		}
	})

	return docs
}

// 获取评论列表
export default async function(connect: Connect, data: {
	limit?: number,
	skip?: number,
	isadmin?: boolean,
	cid?: string,
	format?: string
}){
	const limit_num = data.limit || 10
	const skip_num = data.skip || 0
	const getListForAdmin = data.isadmin
	const format = data.format === 'plain' ? data.format : 'html'
	const {client, db} = await DB.getDB()
	const collection = db.collection('comments')
	const params: {cid?: string} = {}
	if(data.cid && data.cid.length > 1){
		params.cid = data.cid
	}
	// 按照分页获取数据
	const {count, docs} = await DB.getDocsForPagination(collection, {
		params,
		limit: limit_num,
		skip: skip_num,
		sort: {
			time: -1
		}
	})
	// 是否为后台管理列表
	if(getListForAdmin){
		const sessionInstance = await connect.session()
		// 用不到数据库了，关闭连接
		client.close()
		if(sessionInstance.get('user_group') === 'admin'){
			return ({
				count: count,
				list: docs
			})
		}
		return ({
			count: count,
			list: []
		})
	}
	// 普通列表
	// 补齐用户信息
	const list = await makeUpUserInfo(db, docs, format)
	// 用不到数据库了，关闭连接
	client.close()
	return {count, list}
}