/**
 * @author bh-lay
 */
var https = require('https');
var querystring = require('querystring');
var URL = require('url');

function httpsGET(url,data,callback){
	var searchStr = querystring.stringify(data);
	
	https.get(url + searchStr, function(res) {
		var statusCode = res.statusCode;
		var headers = res.headers;
		var content = '';
		res.on('data', function(d) {
			content += d;
		}).on('end', function() {
			callback&&callback(null,{
				'content' : content,
				'headers' : headers
			});
		});
	}).on('error', function(e) {
		callback&&callback(e,null);
	});
}

function httpsPOST(url,data,callback){
	var urlData = URL.parse(url);
	var postData = querystring.stringify(data);
	var conf = {
		hostname : urlData['host'],
		port : urlData['port'] || 80,
		path : urlData['path'],
		method : 'POST',
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded',
			'Content-Length' : postData.length
		}
	};
	var request = https.request(conf, function(resp) {
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
exports.get = function(param){
	var param = param || {};
	var url = param['url'] ? param['url'].toString() : null;
	var data = param['data'] || null;
	var complete = param['complete'] || null;
	
	if(!url){
		return
	}else if(url.slice(0,5) == 'https'){
		httpsGET(url,data,complete);
	}
}
