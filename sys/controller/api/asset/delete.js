/*
 * author bh-lay
 * demo 
 */

var fs = require('fs')
var utils = require('../../../core/utils/index.js')
var assetPath = '../static/'

module.exports = (path, req, callback) => {
	// 消除参数中首尾的｛/｝
	path = path.replace(/^\/|\/$/g,'')

	var pathname = assetPath + path
	fs.lstat(pathname, (err, stat) => {
		if (err) {
			callback && callback('读取目录失败')
			return
		}
		if (stat.isDirectory()) {
			callback && callback('无法删除目录！')
		} else {
			fs.unlink(pathname,function(err){
				if(err){
					callback && callback(err)
				}else{
					callback && callback(null)
				}
			})
		}
	})
}