import { getDbCollection } from '@/database/DB'
import { getRepoInfo } from '@/functions/github'

type repoInfo = {
	name: string;
	full_name: string;
	html_url: string;
	description: string;
	created_at: string;
	updated_at: string;
	pushed_at: string;
	git_url: string;
	homepage: string;
	stargazers_count: number;
	watchers_count: number;
	forks_count: number;
}
// 获取实验室列表
async function getListFromDatabase () {
  const {collection, client} = await getDbCollection('labs')
  const docs = await collection.find({}).toArray()
  client.close()
  return docs.map(function (item) {
    return {
      repoName: item.git_full_name,
      repoId: item.id
    }
  })
}
// 从Github API获取数据
async function getDataFromGithub (repoName: string): Promise<repoInfo> {
  const repItem = await getRepoInfo(repoName) as repoInfo
  return {
    name: repItem.name || '',
    full_name: repItem.full_name || '',
    html_url: repItem.html_url || '',
    description: repItem.description || '',
    created_at: repItem.created_at || '',
    updated_at: repItem.updated_at || '',
    pushed_at: repItem.pushed_at || '',
    git_url: repItem.git_url || '',
    homepage: repItem.homepage || '',
    stargazers_count: repItem.stargazers_count || 0,
    watchers_count: repItem.watchers_count || 0,
    forks_count: repItem.forks_count || 0
  }
}
// 更新实验室单条数据
async function update (id: string, data: repoInfo) {
  const {collection, client} = await getDbCollection('labs')

  await collection.updateOne({
    id: id
  }, {
    $set: {
      github: data
    }
  })
  client.close()
}

export default async function () {
  const repoList = await getListFromDatabase()

  repoList.forEach(function (item,index) {
    // 隔两秒执行一条
    setTimeout(async function () {
      try {
        const repoInfo = await getDataFromGithub(item.repoName)
        // 更新数据
        update(item.repoId, repoInfo)
      } catch (e) {
        console.error(e)
      }
    }, index * 2000)
  })
}
// exports.item = function(repo_name,id,callback){
// 	get_info(repo_name,function(err,data){
// 		if(err){
// 			callback && callback('err')
// 			return
// 		}
// 		// 更新数据
// 		update(id,data,callback)
// 	})
// }