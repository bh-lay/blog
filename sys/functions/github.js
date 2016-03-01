var request = require('request'),
	userAgent = 'bh-lay github api robots';

//从Github API获取数据
function getUserInfo(username,callback){
	console.log('get ' , username , ' info from github!');
	request({
		url: 'https://api.github.com/users/' + username,
		headers: {
			'User-Agent': userAgent
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