/**
 * @author bh-lay
 * 
 */
/**************************************************************
***************************************************************/

var DB = require('../../core/DB.js')
var ObjectID = DB.ObjectID

/**
 * delet method
 */
module.exports = function (ID,callback){
	
	if(!ID || ID.length < 1){
		callback && callback('missing ID') 
		return
	}
	DB.getCollection('comments')
		.then(({collection, closeDBConnect}) => {
			if (isNaN(parseInt(ID))) {
				callback && callback('id 不合法')
				return
			}
			collection.remove({
				'_id' : ObjectID(ID)
			},function(err){
				if(err) {
					callback && callback(err)
				}else {
					callback && callback(null)
				}
				closeDBConnect()
			})
		}).catch(err => {
			callback && callback(err)
		})
}
