
var request = require('request'),
	cache_data = {
      followers: 328,
      public_repos: 30,
      following: 88
	};

//从Github API获取数据
function get_info(){
	var need_keys = "public_repos,followers,following".split(',');

	request({
		url: 'https://api.github.com/users/bh-lay',
		headers: {
			'User-Agent': 'bh-lay github api robot'
		}
	}, function (err, response, body){
		var responseBody,
			userInfo = {};
		if(err,response.statusCode != 200){
			callback && callback('error');
			return;
		}
		responseBody = JSON.parse(body);
		need_keys.forEach(function(item){
			userInfo[item] = responseBody[item];
		});
		cache_data = userInfo;
	});
}

exports.update = get_info;
exports.get = function(){
	return cache_data;
};