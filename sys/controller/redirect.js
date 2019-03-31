/*
 * @author bh-lay
 * 
 */
const base64Decode = str => {
	/* eslint-disable-next-line no-undef */
	return Buffer.from(str, 'base64').toString()
}
module.exports = function (route, connect) {
	// 获取 URL 配置参数
	let target = base64Decode(route.params.target || '')
	let from = connect.request.headers.referer || ''
	connect.write('define', 307, {
		Location: target
	}, '')
}