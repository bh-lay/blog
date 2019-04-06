
let syncTags = require('./syncTags.js')
let updateFriendsScore = require('./updateFriendsScore.js')
exports.sync = () => {
  // 同步标签
  syncTags()
  // 同步好友排行榜
  updateFriendsScore.update()
}