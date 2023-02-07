/**
 * @author bh-lay
 */


let mongodb = require('mongodb')
const mongoConig = require('./../conf/app_config').mongo
const mongoConnectUrl = `mongodb://${mongoConig.host}:${mongoConig.port}/${mongoConig.dbName}`

// 获取数据库
const getDB = () => {
	let MongoClient = mongodb.MongoClient
	return new Promise((resolve, reject) => {
		MongoClient.connect(mongoConnectUrl, {
			useNewUrlParser: true,
			auth: {
				user: mongoConig.user,
				password: mongoConig.pass
			}
		}, (err, client) => {
			if (err) {
				reject()
			} else {
				let db = client.db(mongoConig.dbName)
				resolve({
					client,
					db
				})
			}
		})
	})
}
// 获取数据集合
const getCollection = (collectionName) => {
	return getDB()
		.then(({client, db}) => {
			const collection = db.collection(collectionName)
			
			return {
				collection,
				db,
				client
			}
		})
}
// 使用数据集合获取分页数据
const getPaginationByCollection = (collection, {
	params = {},
	limit = 10,
	skip = 0,
	sort = {}
}) => {
	return new Promise((resolve, reject) => {
		collection.find(params, {
			limit,
			skip,
			sort
		})
		.toArray((err, docs) => {
			if(err){
				reject(err)
				return
			}
			// count the all list
			collection.countDocuments(params, (err,count) => {
				if(err){
					reject(err)
					return
				}
				resolve({
					count,
					docs
				})
			})
		})
	})
}

/**
 * 获取分页数据
 * 
 * @param {Object, String} collectionNameOrCollection 数据集合或数据集合名
 * @param {*} params 查询参数
 */
const getDocsForPagination = (collectionNameOrCollection, params) => {
	if (typeof collectionNameOrCollection === 'string') {
		return getCollection(collectionNameOrCollection)
			.then(({collection, client}) => {
				return getPaginationByCollection(collection, params)
					.then(result => {
						client.close()
						return result
					})
			})
	} else {
		return getPaginationByCollection(collectionNameOrCollection, params)
	}
}
module.exports = {
	getDB,
	getCollection,
	getDocsForPagination,
	ObjectID: mongodb.ObjectID
}
