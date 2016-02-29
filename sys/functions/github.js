var request = require('request');

//从Github API获取数据
function getUserInfo(username,callback){
	request({
		url: 'https://api.github.com/users/' + username,
		headers: {
			'User-Agent': 'bh-lay github api robots'
		}
	}, function (err, response, body){
		var responseBody;
		if(err,response.statusCode != 200){
			callback && callback('error');
			return;
		}
		responseBody = JSON.parse(body);
		callback && callback(null,responseBody);
	});
}
exports.getUserInfo = getUserInfo