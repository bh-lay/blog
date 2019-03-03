/**
 * @author bh-lay
 */
var DB = require('../core/DB.js')

function logError(reportData){
	reportData.test = 1
	// console.log('-------------')
	// console.log('report save error!')
	// console.log(reportData)
	// console.log('-------------')
}

//对外接口
exports.render = function (connect){
	var reportData = connect.url.search

	connect.write('define',200)

	DB.getCollection('report')
		.then(({collection, closeDBConnect}) => {
			collection.insert(reportData,function(err){
				closeDBConnect()
				if(err){
					logError(reportData)
					return
				}
	
			})
		}).catch(() => {
			logError(reportData)
		})
}