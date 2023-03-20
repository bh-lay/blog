import { routeItemMatched, Connect, App } from '@/core/index'
import { formatTime } from '@/lib/utils'
import { getGithubData } from '@/functions/my-github-data'
import getCommentList from '@/controller/api/comments/list'


// 获取用户信息
export default async function (route: routeItemMatched, connect: Connect) {
  const githubSummary = await getGithubData()
  const { list, count } = await getCommentList(connect, {
    limit: 10,
    format: 'plain'
  })
  list.forEach((commentItem) => {
    // 处理url
    if (commentItem.cid == 'define-1') {
      commentItem.url = '/bless'
    } else {
      commentItem.url = '/' + commentItem.cid.replace(/-/g, '/')
    }
    // 转换时间格式
    commentItem.time = formatTime(commentItem.time, '{h}:{i} {m}-{d}')
	
  })
  connect.writeJson({
    code : 200,
    msg : '',
    githubSummary,
    commentList: list
  })
}
