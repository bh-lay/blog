/**
 * @author bh-lay
 * 
 */
import { getDbCollection } from '@/database/DB'
import { routeItemMatched, Connect } from '@/core/index'

/**
 * 获取用户信息
 */
async function getUserDetail (userID: string) {
  const {collection, client} = await getDbCollection('user')

  const userInfo = await collection.findOne({
    id: userID
  })
  client.close()

  if (!userInfo) {
    return null
  }
  if (userInfo && userInfo['password']) {
    delete userInfo['password']
  }
  return userInfo
}
// 获取用户信息
export default async function (route: routeItemMatched, connect: Connect) {
  const { params = {} } = await connect.parseRequestBody()

  // 获取指定用户信息
  if (params.uid) {
    const userDetail = await getUserDetail(params.uid as string)

    return connect.writeJson({
      code : 200,
      detail : userDetail
    })
  }
  // 获取自己的用户信息
  const sessionInstance = await connect.session()
  // session存入comment预留信息
  sessionInstance.set({
    comment_auth : 'ready',
    loginAuth : 'ready'
  })
		
  const uid = sessionInstance.get('uid')
  if (typeof uid === 'string') {
    const detail = await getUserDetail(uid)
    return connect.writeJson({
      code : 200,
      detail : detail
    })
  }
  return connect.writeJson({
    code : 201
  })
}
