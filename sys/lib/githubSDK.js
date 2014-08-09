/**
 * @author bh-lay
 */
var https = require('https');
var querystring = require('querystring');

var CONF = {
	'client_id' : '150e88277697b41e0702',
	'client_secret' : 'a1aa1a69c98375665a58287c2de2ca7636742f65',
	'redirect_uri' : 'http://bh-lay.com/connect/github/'
}
exports.get_token = function (code,callback){
	var postData = querystring.stringify({
		'client_id' : CONF['client_id'],
		'client_secret' : CONF['client_secret'],
		'code' : code,
		'redirect_uri' : CONF['redirect_uri']
	});
	var httpConf = {
		hostname : 'github.com',
		port : 443,
		path : '/login/oauth/access_token',
		method : 'POST',
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded',
			'Content-Length' : postData.length
		}
	};
	var request = https.request(httpConf, function(resp) {
		var res_data = '';
		resp.on('data', function(d) {
			res_data += d;
		}).on('end', function() {
			var res_json = querystring.parse(res_data);
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
		'access_token' : param['access_token']
	};
	console.log('---------');
	console.log(getData);
	var getDataStr = querystring.stringify(getData);
	
	https.get('https://api.github.com/user?' + getDataStr, function(res) {
		console.log("statusCode: ", res.statusCode);
		console.log("headers: ", res.headers);
		var data_str = '';
		res.on('data', function(d) {
			data_str += d;
		}).on('end', function() {
			console.log('111',data_str)
			var res_json = JSON.parse(data_str);
			callback&&callback(null,res_json);
			
		});
	}).on('error', function(e) {
		callback&&callback(e,null);
	});
};