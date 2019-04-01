/*
 * @author bh-lay
 * 
 */
let analysis = require('../functions/analysis/index.js')
const base64Decode = str => {
	/* eslint-disable-next-line no-undef */
	return Buffer.from(str, 'base64').toString()
}
module.exports = function (route, connect, app) {
	// 获取 URL 配置参数
	let target = base64Decode(route.params.target || '')
	analysis.push({
		request: connect.request,
		response: connect.response,
		type: 'redirect',
		params: {
			target
		}
	})
	app.views('system/redirect', {
		target
	}, (err,html) => {
		connect.write('html', 200, html)
	})
}