

// 会变的 title
function loadWechatModel (callback) {
	require.ensure(['./wechat.js'], () => {
		// 异步引入分享模块
		let wechat = require('./wechat.js')
		callback(wechat)
	})
}
// 设置页面 title
export default function setData (title, desc, img) {
	loadWechatModel(wechat => {
		console.log('wechat', wechat)
	})
}
