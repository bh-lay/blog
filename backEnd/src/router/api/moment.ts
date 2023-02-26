// 剧中人的朋友圈
import { routeItemConfig } from '@/core/types'
import momentPostListController from '@/controller/api/moment/post/list'
import momentPostRestController from '@/controller/api/moment/post/rest'
import momentFriendListController from '@/controller/api/moment/friend/list'
import momentFriendRestController from '@/controller/api/moment/friend/rest'
import momentCacheListController from '@/controller/api/moment/cache/list'
import momentCacheRestController from '@/controller/api/moment/cache/rest'
import momentTagsListController from '@/controller/api/moment/tags/list'

const routes: routeItemConfig[] = [
	{
		path: 'get /api/moment/post/',
		controller: momentPostListController
	},
	{
		path: 'rest /api/moment/post/:id',
		controller: momentPostRestController
	},
	{
		path: 'get /api/moment/friend/',
		controller: momentFriendListController
	},
	{
		path: 'rest /api/moment/friend/:id',
		controller: momentFriendRestController
	},
	{
		path: 'get /api/moment/tag/',
		controller: momentTagsListController
	},
	{
		path: 'get /api/moment/cache/',
		controller: momentCacheListController
	},
	{
		path: 'rest /api/moment/cache/:name',
		controller: momentCacheRestController
	}
]
export default routes
