var wx = require('weixin-js-sdk')

let wechatConfigCache = null
let defaultAvatar = '//static.bh-lay.com/user/avatar-small.jpg'

function loadWechatConfig () {
	if (wechatConfigCache) {
		return Promise.resolve(wechatConfigCache)
	}
	return fetch('/api/wechat-sign-signature?url=' + location.href)
		.then(response => response.json())
		.then(data => {
			wechatConfigCache = data.config
			wx.config({
				debug: false,
				appId: wechatConfigCache.appId,
				timestamp: wechatConfigCache.timestamp,
				nonceStr: wechatConfigCache.nonceStr,
				signature: wechatConfigCache.signature,
				jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
			})
			return wechatConfigCache
		})
}

export function updatePageInfo (title, desc, img) {
	loadWechatConfig()
		.then(() => {
			wx.ready(function () {
				let data = {
					title,
					desc,
					link: location.href,
					imgUrl: img || defaultAvatar
				}
				wx.updateAppMessageShareData(data)
				wx.updateTimelineShareData(data)
			})
		})
}
