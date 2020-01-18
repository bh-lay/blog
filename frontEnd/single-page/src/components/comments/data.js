
export var defaultAvatar = require('./default.jpg')

export function setUserInfo ({username, email, blog}) {
	localStorage.setItem('userInfo', JSON.stringify({
		username,
		email,
		blog,
		avatar: email ? '' : defaultAvatar
	}))
}
function getUserInfoFromLocal () {
	let dataStr = localStorage.getItem('userInfo')
	if (!dataStr) {
		return null
	}
	try {
		let data = JSON.parse(dataStr)
		// 增加gravatar头像(md5邮箱)
		if (data.email.length) {
			// data.avatar = '//www.gravatar.com/avatar/' + hexMd5(userInfo.email) + '?s=100';
		}
		return data
	} catch (e) {
		return null
	}
}
function getUserInfoFromServer (onResponse) {
	return fetch('/ajax/user/detail', {
		method: 'POST'
	})
		.then(rsp => rsp.json())
		.then(data => {
			return data.detail || null
		})
}
let userCache = null
export function getUserInfo () {
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
