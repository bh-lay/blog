/*
 * author bh-lay
 * demo 
 */

var fs = require('fs')
var utils = require('../../../core/utils/index.js')

module.exports = (pathname, req, callback) => {
	utils.parse.request(req, function (err, fields) {
		let newFileName = fields.newName || ''
		if (err || pathname.length < 1 || newFileName.length < 1) {
			callback && callback('参数不全')
		} else {
			var newPath = pathname.replace(/[^\/]+$/, newFileName)
			// 检测是否同名
			var exists = fs.existsSync(newPath)
			if (exists) {
				callback && callback('文件重名成功!')
			} else {
				fs.rename(pathname, newPath, err => {
					if (err) {
						callback && callback('出错了')
					} else {
						callback && callback(null)
					}
				})
			}
		}
	})
}
