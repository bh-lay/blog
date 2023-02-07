
let myGithubData = require('../../functions/myGithubData.js')


exports.produce = function(temp,data,callback){
	myGithubData.get(function(err, user_data){
		if (err) {
			user_data = {}
		}
		let html = temp.replace(/>>(\w+)<</g, function (a, key) {
			return user_data[key] || 0
		})
		callback && callback(null, html)
	})
}