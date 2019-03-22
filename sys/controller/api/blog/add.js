/**
 * @author bh-lay
 * 
 */

let DB = require('../../../core/DB.js')
let utils = require('../../../core/utils/index.js')
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
				data.id = utils.createID()
				collection.insertOne(data, function(err){
					if(err){
						reject(new Error('操作失败'))
					} else {
						client.close()
						resolve()
					}
				})
			}).catch(err => {
				reject(new Error('操作失败'))
			})
	})
}