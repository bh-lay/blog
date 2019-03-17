/*
 * @author bh-lay
 */

let DB = require('../../../core/DB.js')

module.exports = function (articleID, format, callback) {
	
	let resJSON={
		code: 200,
		id : articleID,
		format : format
	}
	DB.getCollection('labs')
		.then(({collection, closeDBConnect}) => {
			collection.find({
				id: articleID
			}).toArray(function(err, docs) {
				closeDBConnect()
				if(arguments[1].length==0){
					resJSON['code'] = 2
					resJSON['msg'] = 'could not find this blog !'
				}else{
					resJSON['detail'] = docs[0]
				}
				callback&&callback(resJSON)
			})
		}).catch(() => {
			resJSON.code = 500
			callback&&callback(resJSON)
		})
}