/*
 * author bh-lay
 * demo 
 */

var fs = require('fs')

module.exports = (pathname, req, callback) => {
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