
let syncTags = require('./syncTags.js')
let analyticalFriend = require('./analyticalFriend.js')
let summary = require('./summary.js')
let analyticalPost = require('./analyticalPost.js')

exports.sync = () => {
	// 同步标签
	syncTags()
	// 同步好友排行榜
	analyticalFriend.update()
	// 同步概览数据
	summary.update()
	// 同步动态访问布局
	analyticalPost.update()
}