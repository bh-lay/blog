/**
 * @author bh-lay
 * 
 */
/** ************************************************************
***************************************************************/

var DB = require('../../../../core/DB.js')

/**
 * delet method
 */
module.exports = name => {
	return new Promise((resolve, reject) => {
		if(!name || name.length < 1){
			reject(new Error('missing ID'))
			return
		}
		DB.getCollection('moment_cache')
			.then(({collection, client}) => {
				collection.remove({
					name: name
				}, err => {
					if(err) {
						reject(new Error(err))
					}else {
						resolve()
					}
					client.close()
				})
			}).catch(err => {
				reject(new Error(''))
			})
	})
}
