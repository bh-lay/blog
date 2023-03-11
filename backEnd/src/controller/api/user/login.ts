/**
 * @author bh-lay
 * 
 */
import DB from '@/database/DB'
import { routeItemMatched, Connect, Session, App } from '@/core/index'
import { str2md5 } from '@/lib/utils'


/**
 * 登录
 * 限制五分钟登录五次
 **/
const time_limit = 5 * 60 * 1000
const count_limit = 5
export default async function (route: routeItemMatched, connect: Connect){
	const req = connect.request
	// 登录限定为 POST 方法
	if(req.method !== 'POST'){
		connect.writeJson({
			code : 201,
			msg : 'please use POST to login !'
		})
		return
	}
	// 开启 session 功能
	const sessionInstance = await connect.session()
	// 检测认证信息
	if(sessionInstance.get('loginAuth') !== 'ready'){
		// 不是正常用户，阻止登录
		connect.writeJson({
			code : 201,
			msg : '认证过期，请刷新重试！'
		})
		return
	}
	// 获取登录计数
	const loginCount = sessionInstance.get('loginCount') as number || 0
	// 上次清除登录计数的时间
	const lastLoginTime = sessionInstance.get('lastLoginTime') as number || new Date().getTime() - time_limit * 2
	// 当前时间
	const now = new Date().getTime()

	// 时间间隔在限制之外
	if(now - lastLoginTime > time_limit){
		// 登录计数置为一
		sessionInstance.set({
			loginCount : 1,
			lastLoginTime : now
		})
	}else{
		// 指定时间内 登录次数超过上限，停止处理登录请求
		if(loginCount >= count_limit){
			return connect.writeJson({
				code : 403,
				msg : '回家去吧，求你了！'
			})
		}else{
			// 允许登录，登录计数加一
			sessionInstance.set({
				loginCount : loginCount + 1
			})
		}
	}
	// 获取请求参数
	const { params } = await connect.parseRequestBody()
	const email = params.email as string || ''
	const password = str2md5(params.password as string || '')
	if(!email || password.length < 2){
		return connect.writeJson({
			code: 2,
			msg: 'please input email and password !'
		})
	}
	await handleLogin(connect, sessionInstance, email, password)
}

async function getUserGroupPower(userGroupStr: string){
	const {collection, client} = await DB.getCollection('user_group')
	const docs = await collection.find({'user_group': userGroupStr}).toArray()
	client.close()
	const userGroup = docs[0]
	if (!userGroup) {
		return null
	}
	return userGroup.power as string
}

// 处理login
async function handleLogin(connect: Connect, sessionInstance: Session, username: string, password: string){
	// matche user
	const {collection, client} = await DB.getCollection('user')

	const docs = await collection.find({
		email: username,
		password: password
	}).toArray()

	if(!docs || docs.length === 0){
		// 账号or密码 错了
		return connect.writeJson({
			code: 2,
			msg: '二货，帐号密码输错了吧！'
		})
	}
	const user = docs[0]
	const userGroup = user.user_group as string
	const powerCode = await getUserGroupPower(userGroup)

	client.close()
	const userid = user.id as string
	sessionInstance.set({
		user_group : userGroup,
		username : user.username, 
		uid : userid,
		powerCode
	})
	if(user.password){
		delete user.password
	}
			
	connect.writeJson({
		code: 200,
		user: user
	})
}