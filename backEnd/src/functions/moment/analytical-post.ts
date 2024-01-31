import { getDbConnect } from '@/database/DB'
import { count as analysisCount } from '@/functions/analysis/index'

export default async function () {
  const {client, db} = await getDbConnect()
  const postCollection = db.collection('moment_post')
  // TODO: fix MongoDriverError: Attempted to use a session that has ended
  const postList = await postCollection.find({}).toArray()
  const promiseList = postList.map(async function (doc) {
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
