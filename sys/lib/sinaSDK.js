/**
 * @author bh-lay
 */
var https = require('https');
var querystring = require('querystring');

var CONF = {
	'AppKey' : 2861592023,
	'AppSecret' : 'b3074ebef0eaaa980995c14eac798353'
}
exports.get_token = function (code,callback){
	var postData = querystring.stringify({
 		'grant_type' : 'authorization_code',
		'code' : code,
 		'redirect_uri' : 'http://bh-lay.com/',
		'client_id' : CONF['AppKey'],
		'client_secret' : CONF['AppSecret']
	});
	var weiboConf = {
		hostname : 'api.weibo.com',
		port : 443,
		path : '/oauth2/access_token',
		method : 'POST',
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded',
			'Content-Length' : postData.length
		}
	};
	var request = https.request(weiboConf, function(resp) {
		var res_data = '';
		resp.on('data', function(d) {
			res_data += d;
		}).on('end', function() {
			var res_json = JSON.parse(res_data);
			var err = null;
			if(res_json.error){
				err = 'error';
			}
			callback&&callback(err,res_json);
		});
	});
	request.write(postData);
	request.end();
	request.on('error', function(e) {
		callback&&callback(e,null);
	});
};

exports.userInfo = function (param,callback){
	var getData = {
		'source' : CONF['AppKey'],
		'access_token' : param['access_token']
	};
	if(param['uid']){
		getData['uid'] = param['uid'];
	}else if(param['screen_name']){
		getData['screen_name'] = param['screen_name'];
	}
	var getDataStr = querystring.stringify(getData);
	
	https.get('https://api.weibo.com/2/users/show.json?' + getDataStr, function(res) {
		console.log("statusCode: ", res.statusCode);
		console.log("headers: ", res.headers);
		res.on('data', function(d) {
			var res_json = JSON.parse(d);
			callback&&callback(null,res_json);
		});
	}).on('error', function(e) {
		callback&&callback(e,null);
	});
};