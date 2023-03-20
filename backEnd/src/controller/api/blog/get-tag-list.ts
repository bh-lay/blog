/**
 * @author bh-lay
 *
 */
import DB from '@/database/DB'

export default async function getTagsList () {
  const { collection, client } = await DB.getCollection('article')
  const docs = await collection.find().toArray()

  client.close()

  const tagsObj: Record<string, number> = {}
  const tagsArray: {name: string, count: number}[] = []
  if (!docs || docs.length === 0) {
    return tagsArray
  }
  // 获取所有标签
  docs.forEach((article) => {
    const this_tags = article.tags
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
