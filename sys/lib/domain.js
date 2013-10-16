var request = require('request');
var url = 'http://panda.www.net.cn/cgi-bin/check.cgi?area_domain=mingaiwang56.com';
function get_code(body){
	if(body){
		console.log(body.match(/\<original\>(.+)\:/)[1]);
	}else{
		console.log('23');
	}
}
request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    get_code(body);
  }
});