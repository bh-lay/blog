export { default as defaultAvatar } from './default.jpg'

export interface UserData {
	username: string
	email: string
	blog: string
	avatar: string
}

const defaultUserData: UserData = {
	username: '',
	email: '',
	blog: '',
	avatar: ''
}

export function setUserInfo ({ username, email, blog, avatar }: UserData) {
	localStorage.setItem('userInfo', JSON.stringify({
		username,
		email,
		blog,
		avatar
	}))
}

function getUserInfoFromLocal (): UserData {
	const dataStr = localStorage.getItem('userInfo')
	if (!dataStr) {
		return Object.assign({}, defaultUserData)
	}
	try {
		return JSON.parse(dataStr)
	} catch (e) {
		return Object.assign({}, defaultUserData)
	}
}

function getUserInfoFromServer (): Promise<UserData | null> {
	return fetch('/api/user/detail', {
		method: 'POST'
	})
		.then(rsp => rsp.json())
		.then(data => {
			return data.detail || null
		})
}

let userCache: UserData | null = null

export function getUserInfo (): Promise<UserData | null> {
	// 若有登陆缓存，则直接使用
	if (userCache) {
		return Promise.resolve(userCache)
	}
	// 向服务器请求用户信息
	return getUserInfoFromServer()
		.then(user => {
			if (user) {
				// 优先级一：已登陆
				userCache = user
				return user
			}
			// 优先级二：本地缓存
			return getUserInfoFromLocal()
		})
}
