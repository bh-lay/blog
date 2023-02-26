import syncTags from './sync-tags'
import analyticalPost from './analytical-post'
import analyticalFriend from './analytical-friend'

export default async function () {
	// 同步标签
	try {
		syncTags()
	} catch (e) {
		console.error(e)
	}
	// 同步好友排行榜
	try {
		analyticalFriend()
	} catch (e) {
		console.error(e)
	}
	// 同步动态访问布局
	try {
		analyticalPost()
	} catch (e) {
		console.error(e)
	}
}