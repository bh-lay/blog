/**
 * @author bh-lay
 *
 */
import * as mongodb from 'mongodb'
import DB from '@/database/DB'

type tagItemInfo = {
	name: string,
	count: number
}

async function getTagsList (DBClient: mongodb.Db) {
	const collection = DBClient.collection('moment_post')
	const docs = await collection.find().toArray()


	const tagsObj: Record<string, number> = {}
	const tagsArray: tagItemInfo[] = []
	// 获取所有标签
	docs.forEach((docItem) => {
		const this_tags = docItem.tags
		if (Object.prototype.toString.call(this_tags) == '[object Array]') {
			for (let s = 0, count = this_tags.length; s < count; s++) {
				const tagStr = this_tags[s]
				tagsObj[tagStr] = tagsObj[tagStr] ? tagsObj[tagStr] + 1 : 1
			}
		}
	})

	// 转换为数组
	for (const k in tagsObj) {
		tagsArray.push({
			name: k,
			count: tagsObj[k]
		})
	}
	// 排序
	tagsArray.sort(function (x, y) {
		return y.count - x.count
	})
	return tagsArray
}
async function addOrUpdateTag (collection: mongodb.Collection<mongodb.Document>, {name, count}: tagItemInfo) {
	const resultCount = await collection.countDocuments({
		name
	})

	const isExist = resultCount > 0
	if (isExist) {
		await collection.updateOne({ name }, {
			$set: { count }
		})
	} else {
		await collection.insertOne({
			name,
			count,
			desc: '',
			createTime: new Date().getTime()
		})
	}
}
export default async function () {
	const {client, db} = await DB.getDB()
	const tagsArray = await getTagsList(db)
	if (tagsArray.length === 0) {
		return
	}
	const tagCollection = db.collection('moment_tag')
	const updatePromiseQueue: Promise<void>[] = []
	tagsArray.forEach(tag => {
		updatePromiseQueue.push(addOrUpdateTag(tagCollection, tag))
	})
	try {
		await Promise.all(updatePromiseQueue)
		client.close()
	} catch (e) {
		console.warn(e)
		client.close()
	}
}
