import { getDbCollection } from '@/database/DB'
import { getUserInfo, githubUserInfo } from './github'

const collection_name = 'cache'
const mongon_ID = 'github_bh-lay'

// 从Github API更新数据
export async function updateDatabaseFromGithub () {
  const info = await getUserInfo('bh-lay')
  await saveDataToDataBase(info)
  return info
}

export async function getGithubData (): Promise<githubUserInfo> {
  const {collection, client} = await getDbCollection(collection_name)
  const docs = await collection.find({
    id : mongon_ID
  }).toArray()
  client.close()
  if (!docs || docs.length === 0) {
    // 若不存在，则从 Github 上获取
    return await updateDatabaseFromGithub()
  }
  return docs[0] as githubUserInfo

}
// 保存到数据库
async function saveDataToDataBase (data: githubUserInfo) {
  const {collection, client} = await getDbCollection(collection_name)
  // 计算条数
  const count = await collection.countDocuments({
    id : mongon_ID
  })
  if (count > 0) {
    // 条数存在，则直接更新
    await collection.updateOne({
      id: mongon_ID
    }, {
      $set: data
    })
  } else {
    // 不存在则插入为新数据
    await collection.insertOne(data)
  }
  client.close()
}
