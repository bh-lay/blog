/*
 * author bh-lay
 * demo 
 */

var fs = require('fs')
var utils = require('../../../core/utils/index.js')
var assetPath = '../static/'

module.exports = function (pathname, dirName, callback){

	let Path = pathname + '/' + dirName
	
	// 检测是否同名
	let exists = fs.existsSync(Path)
	if(exists){
		callback && callback('目录重名')
	}else{
		fs.mkdir(Path, function(err){
			if(err){
				callback && callback('出错了')
			}else{
				callback && callback(null)
			}
		})
	}
}
