
// author bh-lay
import DB from '@/core/DB'

type friend = {
	github_username: string | undefined,
	cover: string | undefined,
	url: string | undefined,
	adminScore: number | string | undefined
}
const countScore = (item: friend) => {
	const hasGithub = item.github_username && item.github_username.length > 2 ? 1 : 0
	const hasCover = item.cover && item.cover.length > 10 ? 1 : 0
	const hasBlog = item.url && item.url.length > 10 ? 1 : 0
	const adminScore = typeof item.adminScore === 'number' ? item.adminScore : parseInt(item.adminScore || '0')
	return hasGithub * 4 + hasBlog * 3 + hasCover * 2 + adminScore
}

export default async function () {
	const {client, db} = await DB.getDB()
	const friendCollection = db.collection('friends')

	const postList = await friendCollection.find({}).toArray()
	const promiseLIst = postList.map(async function (doc) {
		const score = countScore(doc as friend)
				
		const userid = doc.id
		const {collection, client} = await DB.getCollection('moment_post')

		const postCount = await collection.countDocuments({
			userid
		})
		await friendCollection.updateOne({
			_id: doc._id
		}, {
			$set: {
				score,
				analysis: {
					postCount
				}
			}
		})
	})
	await Promise.all(promiseLIst)
	client.close()
}