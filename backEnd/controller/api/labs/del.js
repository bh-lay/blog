/**
 * @author bh-lay
 * 
 */
/** ************************************************************
***************************************************************/

var DB = require('../../../core/DB.js')

/**
 * delet method
 */
module.exports = ID => {
	return new Promise((resolve, reject) => {
		if(!ID || ID.length < 1){
			reject(new Error('missing ID'))
			return
		}
		DB.getCollection('labs')
			.then(({collection, client}) => {
				if (isNaN(parseInt(ID))) {
					reject(new Error('id 不合法'))
					return
				}
				collection.remove({
					id : ID
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
