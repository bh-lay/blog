/*
 * @author bh-lay
 */
import DB from '@/database/DB'
const collectionName = 'moment_cache'

// 获取缓存
export async function getCache(cacheName: string) {
	const {collection, client} = await DB.getCollection(collectionName)
	const doc = await collection.findOne({
		name: cacheName
	})
	client.close()
	return doc
}

// 设置缓存
export async function setCache (cacheName: string, content: string) {
	const {client, db} = await DB.getDB()
	const collection = db.collection(collectionName)
	// 获取缓存名下的文档总数
	const resultCount = await collection.countDocuments({
		name: cacheName
	})

	const isExist = resultCount > 0
	if (isExist) {
		// 存在，则更新缓存
		await collection.updateOne({
			name: cacheName
		}, {
			$set: {
				content,
				updateTime: new Date().getTime()
			}
		})
	} else {
		// 不存在，则插入一条
		await collection.insertOne({
			name: cacheName,
			content,
			updateTime: new Date().getTime()
		})
	}
	client.close()
}

export async function removeCache(name: string) {
	if(!name || name.length < 1){
		return Promise.reject(new Error('missing ID'))
	}
	const {collection, client} = await DB.getCollection(collectionName)
	await collection.deleteOne({
		name: name
	})
	client.close()
}

