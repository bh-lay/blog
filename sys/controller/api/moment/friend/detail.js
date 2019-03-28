/*
 * @author bh-lay
 */

let DB = require('../../../../core/DB.js')

let showdown  = require('showdown')

module.exports = function (friendsID, format, callback) {
	
	let resJSON={
		code: 200,
		id : friendsID,
		format : format
	}
	DB.getCollection('friends')
		.then(({collection, client}) => {
			collection.find({
				id: friendsID
			}).toArray(function(err, docs) {
				client.close()
				if(arguments[1].length==0){
					resJSON['code'] = 2
					resJSON['msg'] = 'could not find this blog !'
				}else{
					resJSON['detail'] = docs[0]
					if(format == 'html'){
						var converter = new showdown.Converter()
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