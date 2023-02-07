/*
 * author bh-lay
 * demo 
 */

var fs = require('fs')
var utils = require('../../../core/utils/index.js')

module.exports = (pathname, req, callback) => {
	utils.parse.request(req, function (err, fields, files) {
		var errorFiles = []
		if (err) {
			callback && callback(err)
		} else if (files.length) {
			var newFiles = []

			for (var i in files) {
				var newPath = pathname + '/' + files[i].name

				// 禁止上传同名文件
				var exists = fs.existsSync(newPath)
				if (exists) {
					errorFiles.push({
						'name': files[i]['name']
					})
				} else {
					fs.rename(files[i].path, newPath, () => { })
					newFiles.push({
						'name': files[i]['name']
					})
				}
			}
			callback && callback(null, newFiles)
		}
	})
}
