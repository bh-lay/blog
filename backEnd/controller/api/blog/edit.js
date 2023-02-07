/**
 * @author bh-lay
 * 
 */
let DB = require('../../../core/DB.js')
let parseData = require('./parse.js')
let collectionName = 'article'

module.exports = params => {
	let data = parseData(params)
	return new Promise((resolve, reject) => {
		if (!data) {
			reject(new Error('请输入完整数据！'))
		}
		DB.getCollection(collectionName)
			.then(({collection, client}) => {
				collection.updateOne({
					id: params.id
				}, {
					$set: params
				}, function(err) {
					if(err) {
						reject(new Error('操作失败'))
					}else {
						resolve()
					}
					client.close()
				})
			}).catch(err => {
				reject(new Error('操作失败'))
			})
	})
}