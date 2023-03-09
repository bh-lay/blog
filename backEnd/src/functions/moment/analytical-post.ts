import DB from '@/database/DB'
import { count as analysisCount } from '@/functions/analysis/index'

export default async function () {
	const {client, db} = await DB.getDB()
	const postCollection = db.collection('moment_post')

	const postList = await postCollection.find({}).toArray()
	const promiseList = postList.map(async function(doc) {
		const target = doc.originalUrl
		const result = await analysisCount('redirect', {
			target
		})
		await postCollection.updateOne({
			_id: doc._id
		}, {
			$set: {
				analysis: {
					pv: result.pv
				}
			}
		})
	})
	await Promise.all(promiseList)
	client.close()
}