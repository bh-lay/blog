/**
 * @author bh-lay
 *
 */
import * as mongodb from 'mongodb'
import { getDbConnect } from '@/database/DB'

type tagItemInfo = {
	name: string,
	count: number
}

async function getTagsList (DBClient: mongodb.Db) {
  const collection = DBClient.collection('moment_post')
  type tagItem = {
    count: number,
    name: string
  }
  const cursor: mongodb.AggregationCursor<tagItem> = await collection.aggregate()
    .unwind('$tags')
    .group({
      _id: '$tags',
      count: { $sum: 1 }
    })
    .sort({
      count: -1
    })
    .project<tagItem>({
      _id: 0,
      name: {
        $convert: {
          input: '$_id',
          to: 'string'
        },
      },
      count: 1
    })
    .limit(30)

  const tagsArray = await cursor.toArray()
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
  const {client, db} = await getDbConnect()
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
