var request = require('request'),
	clientUserAgent = 'bh-lay github api robots';

//从Github API获取数据
function getReposInfo(repo_name,callback){
	repo_name = repo_name.replace(/^\//,'');
	request({
		url: 'https://api.github.com/repos/' + repo_name,
		headers: {
			'User-Agent': clientUserAgent
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

//从Github API获取数据
function getUserInfo(username,callback){
	request({
		url: 'https://api.github.com/users/' + username,
		headers: {
			'User-Agent': clientUserAgent
		}
	}, function (err, response, body){
		response = response || {};
		var responseBody;
		if(err,response.statusCode != 200){
			callback && callback('error');
			return;
		}
		responseBody = JSON.parse( body || {} );
		callback && callback(null,responseBody);
	});
}

exports.getUserInfo = getUserInfo;
exports.getReposInfo = getReposInfo;