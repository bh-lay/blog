// 剧中人的朋友圈

let momentPost = require('../../controller/api/moment/post/index.js')
let momentTag = require('../../controller/api/moment/tags/index.js')
let momentFriend = require('../../controller/api/moment/friend/index.js')
let momentCache = require('../../controller/api/moment/cache/index.js')

module.exports = [
	{
		path: 'get /api/moment/post/',
		controller: momentPost.list
	},
	{
		path: 'rest /api/moment/post/:id',
		controller: momentPost
	},
	{
		path: 'get /api/moment/friend/',
		controller: momentFriend.list
	},
	{
		path: 'get /api/moment/tag/',
		controller: momentTag.list
	},
	{
		path: 'rest /api/moment/tag/:id',
		controller: momentPost
	},
	{
		path: 'rest /api/moment/friend/:id',
		controller: momentFriend
	},
	{
		path: 'get /api/moment/cache/',
		controller: momentCache.list
	},
	{
		path: 'rest /api/moment/cache/:name',
		controller: momentCache
	}
]