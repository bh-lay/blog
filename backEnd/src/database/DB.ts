/**
 * @author bh-lay
 */
import * as mongodb from 'mongodb'

// 获取数据库
export async function getDbConnect (): Promise<{
	client: mongodb.MongoClient,
	db: mongodb.Db
}> {
  const MongoClient = mongodb.MongoClient
  const mongoConig = {
    host: process.env.mongoHost,
    port: process.env.mongoPort,
    user: process.env.mongoUser,
    pass: process.env.mongoPwd,
    dbName: process.env.mongoDBName
  }
  const mongoConnectUrl = `mongodb://${mongoConig.host}:${mongoConig.port}`

  const client = await MongoClient.connect(mongoConnectUrl, {
    auth: {
      username: mongoConig.user,
      password: mongoConig.pass
    }
  })

  const db = client.db(mongoConig.dbName)
  
  // close connect when timout
  const originCloseMethod = client.close
  client.close = function (): Promise<void> {
    clearTimeout(closeTimoutTimer)
    return originCloseMethod.apply(client) as unknown as Promise<void>
  }
  const closeTimoutTimer = setTimeout(() => {
    console.trace('MongoDB missing close connect.')
    originCloseMethod()
  }, 1000)

  return {
    client,
    db
  }
}
// 获取数据集合
export async function getDbCollection (collectionName: string): Promise<{
	client: mongodb.MongoClient,
	db: mongodb.Db,
	collection: mongodb.Collection
}> {
  const {client, db} = await getDbConnect()
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
async function getPaginationByCollection (collection: mongodb.Collection, options: paginationOptions) {
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
export async function getDocsByPagination (collectionNameOrCollection: mongodb.Collection | string, params: paginationOptions) {
  if (typeof collectionNameOrCollection === 'string') {
    const {collection, client} = await getDbCollection(collectionNameOrCollection)

    const result = await getPaginationByCollection(collection, params)
    client.close()
    return result
  }
  return await getPaginationByCollection(collectionNameOrCollection, params)
}

export function generateDbObjectId (id: string) {
  return new mongodb.ObjectId(id)
}
