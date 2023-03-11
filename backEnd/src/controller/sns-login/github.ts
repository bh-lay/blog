import DB from '@/database/DB'
import { Connect } from '@/core/index'
import { createID } from '@/lib/utils'
import { getAccessToken, getUserInfoByToken } from '@/lib/github-sdk'

async function hanldGithubLogin(connect: Connect) {
	const code = connect.url.search.code as string
	if(!code){
		throw Error('missing code')
	}
	const accessToken = await getAccessToken(code)
	const userDataFromGithub = await getUserInfoByToken(accessToken)

	const {collection, client, db} = await DB.getCollection('user')
	const userDataInDatabase = await collection.findOne({
		github_id: userDataFromGithub.id
	})
	// 老用户
	if (userDataInDatabase) {
		client.close()
		return userDataInDatabase
	}
	// 新用户
	const userInfo = {
		id: createID,
		username: userDataFromGithub.name,
		email: userDataFromGithub.email || null,
		avatar: userDataFromGithub.avatar_url,
		user_group: 'user',
		github_id: userDataFromGithub.id,
	}

	const userCollection = db.collection('user')
	await userCollection.insertOne(userInfo)
	client.close()
	return userInfo
}
// 对外接口
export default async function (connect: Connect){
	let data = {}
	try {
		const userInfo = await hanldGithubLogin(connect)
	  const sessionInstance = await connect.session()

		const {collection, client, db} = await DB.getCollection('user_group')
		const userGroupInfo = await collection.findOne({
			user_group: userInfo.user_group
		})
		client.close()

		let powerCode = '000000000'
		if (userGroupInfo) {
			powerCode = userGroupInfo.power
		}

		sessionInstance.set({
			user_group: userInfo.user_group,
			username: userInfo.username, 
			uid: userInfo.id,
			avatar: userInfo.avatar,
			powerCode: powerCode
		})
		delete userInfo.password
		data = userInfo
	} catch (e) {
		console.error(e)
	}
	const html = await connect.views('sns-login',{
		from : 'github',
		data : JSON.stringify(data)
	})
	connect.writeHTML(200,html)
}