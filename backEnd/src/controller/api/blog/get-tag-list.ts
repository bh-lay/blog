/**
 * @author bh-lay
 *
 */
import * as mongodb from 'mongodb'
import { getDbCollection } from '@/database/DB'

export default async function getTagsList () {
  const { collection, client } = await getDbCollection('article')
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

  client.close()


  return tagsArray
}
