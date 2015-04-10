/**
 * @author bh-lay
 */
var https = require('https');
var querystring = require('querystring');

var CONF = {
	'client_id' : '150e88277697b41e0702',
	'client_secret' : 'a1aa1a69c98375665a58287c2de2ca7636742f65',
	'redirect_uri' : 'http://bh-lay.com/snsLogin/github/'
}
exports.get_token = function (code,callback){
	var postData = querystring.stringify({
		'client_id' : CONF['client_id'],
		'client_secret' : CONF['client_secret'],
		'code' : code,
		'redirect_uri' : CONF['redirect_uri']
	});
	//console.log('get token',postData);
	var request = https.request({
		'hostname' : 'github.com',
		'port' : 443,
		'path' : '/login/oauth/access_token',
		'method' : 'POST',
		'headers' : {
			'Content-Type' : 'application/x-www-form-urlencoded',
			'User-Agent' : 'L-plain-text',
			'Content-Length' : postData.length
		}
	}, function(resp) {
		var res_data = '';
		resp.on('data', function(d) {
			res_data += d;
		}).on('end', function() {
			var res_json = querystring.parse(res_data);
			var err = null;
			if(res_json.error){
				err = 'error';
			}
			console.log('token',res_json);
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
	
	var getDataStr = querystring.stringify({
		'access_token' : param['access_token']
	});
	
	//console.log('get userinfo');
	//console.log(getDataStr);
	var request = https.request({
		'hostname' : 'api.github.com',
		'port' : 443,
		'path' : '/user?' + getDataStr,
		'method' : 'GET',
		'headers' : {
			'Content-Type' : 'text/html',
			'User-Agent' : 'L-plain-text',
		}
	}, function(resp) {
		var res_data = '';
		resp.on('data', function(d) {
			res_data += d;
		}).on('end', function() {
			var res_json = querystring.parse(res_data);
			var err = null;
			if(res_json.error){
				err = 'error';
			}
			
			//console.log('userinfo',res_data);
			var res_json = JSON.parse(res_data);
			callback&&callback(err,res_json);
		});
	});
	
	request.on('error', function(e) {
		callback && callback(e,null);
	});
	
	request.end();
};