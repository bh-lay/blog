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
module.exports = ID => {
	if(!ID || ID.length < 1){
		return Promise.reject(new Error('missing ID'))
	}
	return DB.getCollection('moment_post')
		.then(({collection, client}) => {
			return new Promise((resolve, reject) => {
				collection.remove({
					id : ID
				}, err => {
					if(err) {
						reject(new Error(err))
					} else {
						resolve()
					}
					client.close()
				})
			})
		})
}
