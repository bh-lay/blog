/*
 * @author bh-lay
 */

let DB = require('../../../../core/DB.js')

let showdown  = require('showdown')

module.exports = function (momentID, format, callback) {
	
	let resJSON={
		code: 200,
		id : momentID,
		format : format
	}
	DB.getCollection('moment')
		.then(({collection, client}) => {
			collection.find({
				id: momentID
			}).toArray(function(err, docs) {
				client.close()
				if(arguments[1].length==0){
					resJSON['code'] = 2
					resJSON['msg'] = 'could not find this blog !'
				}else{
					resJSON['detail'] = docs[0]
					if(format == 'html'){
						var converter = new showdown.Converter()
						converter.setOption('noHeaderId', true)
						resJSON['detail'].content = converter.makeHtml(resJSON['detail'].content)
					}
				}
				callback&&callback(resJSON)
			})
		}).catch(() => {
			resJSON.code = 500
			callback&&callback(resJSON)
		})
}