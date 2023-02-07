/**
 * @author bh-lay
 */
var fs = require('fs')

module.exports = function (pathname, callback){
	
	var res = []
	fs.readdir(pathname, function(err,files){
		if(err){
			callback && callback(err)
			return
		}
		files.forEach(function(file){
			let filePath = pathname + '/' + file
			let stat = fs.lstatSync(filePath)
	
			if (stat.isDirectory()){
				res.push({
					'name' : file,
					'isdir' : true
				})
			} else {
				res.push({
					'name' : file,
					'isdir' : false
				})
			}
		})
		callback && callback(null,res)
	})
}
