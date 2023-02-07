/*
 * @author bh-lay
 */
let DB = require('../../core/DB.js')
let cache = require('./cache.js')
const createPromise = (DBClient, {collectionName, label, unit}) => {
	let collection = DBClient.collection(collectionName)
	return new Promise((resolve, reject) => {
		collection.countDocuments((err, count) => {
			if (err) {
				reject()
			} else {
				resolve({
					count,
					label,
					unit
				})
			}
		})
	})
}
const updateSummary = () => {
	return DB.getDB().then(({client, db}) => {
		let queryList = [
			{
				collectionName: 'moment_post',
				label: '文章引入',
				unit: '篇'
			},
			{
				collectionName: 'moment_tag',
				label: '常用标签',
				unit: '个'
			},
			{
				collectionName: 'friends',
				label: '好友入驻',
				unit: '位'
			}
		]
		let promiseArray = queryList.map(queryItem => createPromise(db, queryItem))
		return Promise.all(promiseArray)
			.then(list => {
				cache.save('summary', list)
			})
	})
}
exports.update = updateSummary
