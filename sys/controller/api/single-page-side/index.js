let comments = require('./comments.js')
let myGithubData = require('../../../functions/myGithubData.js')


// 获取用户信息
module.exports = function (route, connect){
	myGithubData.get(function(err, githubSummary){
		comments(function (err, commentList) {
			connect.write('json',{
				code : 200,
				msg : err,
				githubSummary,
				commentList
			})
		})
	})
}
