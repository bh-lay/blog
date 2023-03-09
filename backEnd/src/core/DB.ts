/**
 * @author bh-lay
 */
import * as mongodb from 'mongodb'

// 获取数据库
async function getDB(): Promise<{
	client: mongodb.MongoClient,
	db: mongodb.Db
}> {
	const MongoClient = mongodb.MongoClient
	const mongoConig = {
		host: process.env.mongoHost,
		port: process.env.mongoPort,
		user: process.env.mongoUser,
		pass: process.env.mongoPwd,
		dbName: process.env.MongoDBName
	}
	const mongoConnectUrl = `mongodb://${mongoConig.host}:${mongoConig.port}`

	const client = await MongoClient.connect(mongoConnectUrl, {
		auth: {
			username: mongoConig.user,
			password: mongoConig.pass
		}
	})

	const db = client.db(mongoConig.dbName)
	return {
		client,
		db
	}
}
// 获取数据集合
async function getCollection(collectionName: string): Promise<{
	client: mongodb.MongoClient,
	db: mongodb.Db,
	collection: mongodb.Collection
}> {
	const {client, db} = await getDB()
	const collection = db.collection(collectionName)
	return {
		collection,
		db,
		client
	}
}

export type paginationOptions = {
		params: Record<string, unknown>,
		limit: number,
		skip: number,
		sort?: mongodb.Sort
}
// 使用数据集合获取分页数据
async function getPaginationByCollection(collection: mongodb.Collection, options: paginationOptions) {
	const {
		params = {},
		limit = 10,
		skip = 0,
		sort = {}
	} = options
	const docs = await collection.find(params, {
		limit,
		skip,
		sort
	})
		.toArray()
	const count = await collection.countDocuments(params)

	return {
		count,
		docs
	}
}

/**
 * 获取分页数据
 * 
 * @param {Object, String} collectionNameOrCollection 数据集合或数据集合名
 * @param {*} params 查询参数
 */
const getDocsForPagination = async (collectionNameOrCollection: mongodb.Collection | string, params: paginationOptions) => {
	if (typeof collectionNameOrCollection === 'string') {
		const {collection, client} = await getCollection(collectionNameOrCollection)

		const result = await getPaginationByCollection(collection, params)
		client.close()
		return result
	}
	return await getPaginationByCollection(collectionNameOrCollection, params)
}
export default {
	getDB,
	getCollection,
	getDocsForPagination,
	ObjectId: mongodb.ObjectId
}
