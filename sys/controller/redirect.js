/*
 * @author bh-lay
 * view url : /blog    /blog/
 */


var utils = require('../core/utils/index.js')
var DB = require('../core/DB.js')

const base64Encode = str => {
	/* eslint-disable-next-line no-undef */
	return Buffer.from(str).toString('base64')
}
const base64Decode = str => {
	/* eslint-disable-next-line no-undef */
	return Buffer.from(str, 'base64').toString()
}
module.exports = function (route, connect) {
	// 获取 URL 配置参数
	let target = base64Decode(route.params.target || '')
	let from = connect.request.headers.referer
console.log(connect.request.headers)
	connect.write('json',{
		code: 1,
		msg: '',
		target,
		from
	})
}