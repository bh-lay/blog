
/*
 * @author bh-lay
 */
import * as mongodb from 'mongodb'
import { routeItemMatched, Connect } from '@/core/index'

import { getDbConnect, getDocsByPagination } from '@/database/DB'
import { encodeHtml } from '@/lib/utils'

const collectionName = 'moment_post'
const showdown  = require('showdown')

type momentPost = {
	userid?: string,
	user: unknown 
}
/**
 * 处理评论数据
 *  增加用户信息
 *
 **/
async function makeUpUserInfo (db: mongodb.Db, momentList: momentPost[]) {
  const userIDList: string[] = []
  // 挨个构建获取用户信息对象
  const userCollection = db.collection('friends')
  // 遍历评论列表，获取所有需要的用户id
  momentList.forEach((item) => {
    if (item.userid && userIDList.indexOf(item.userid) === -1) {
      userIDList.push(item.userid)
    }
  })
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
  momentList.forEach(function (item) {
    if (item.userid && users[item.userid]) {
      item.user = users[item.userid]
    } else if (!item.user) {
      item.user = {}
    }
  })
  return momentList
}

export default async function (route: routeItemMatched, connect: Connect) {
  const data = connect.url.search

  const limit_num = parseInt(data.limit as string) || 10
  const skip_num = parseInt(data.skip as string) || 0
  const params: Record<string, unknown> = {}
  // 内容由 markdown 转为 html
  const markdownConverter = new showdown.Converter()
  markdownConverter.setOption('noHeaderId', true)
  // 过滤标签
  if (data.tag) {
    params.tags = data.tag
  }
  if (data.userid) {
    params.userid = data.userid
  }
	
  // 按照分页获取数据
  const {client, db}= await getDbConnect()

  const collection = db.collection(collectionName)
  const {count, docs} = await getDocsByPagination(collection, {
    params,
    limit: limit_num,
    skip: skip_num,
    sort: {
      createTime: -1
    }
  })
  docs.forEach(item => {
    const content = encodeHtml(item.content)
    item.content = markdownConverter.makeHtml(content)
  })
  const newDocs = await makeUpUserInfo(db, docs as momentPost[])

  client.close()
  connect.writeJson({
    code: 1,
    limit: limit_num,
    skip: skip_num,
    count,
    list: newDocs
  })
}