

var request = require('request');
var api_url =  'http://panda.www.net.cn/cgi-bin/check.cgi?area_domain=';

function get_code(domain_name,callback){
	var code = 404;
	request(api_url + domain_name, function (error, response, body) {
		if(!error && response.statusCode == 200 && body){
			code = body.match(/\<original\>(.+)\:/)?parseInt(body.match(/\<original\>(.+)\:/)[1]):404;
		}
		callback({
			'url' : domain_name,
			'code' : code
		})
	});
}

exports.query = function(main,extension,callback){

	var results = [];

	if(arguments.length < 3 || typeof(main) != 'string'){
		callback(results);
		return
	}
	main = main.split(/\./)[0];
	
	if(typeof(extension) == 'string' ){
		var domain_name = main + '.' + extension;
		get_code(domain_name,function(data){
			results.push(data);
			callback&&callback(results)
		});
		
	}else if(Object.prototype.toString.call(extension) == "[object Array]"){
		var total = extension.length;
		if(total == 0){
			callback&&callback(results);
			return
		}
		for(var i = 0;i<total;i++){
			var domain_name = main + '.' + extension[i];
			get_code(domain_name,function(data){
				results.push(data);
				if(results.length == total){
					callback&&callback(results)
				}
			});
		}
	}else{
		callback&&callback(results);
	}
}


//	var domain = require('./lib/domain');
//	domain.query('shenhongmqwerty',['com','cn','gov'],function(){
//		console.log('lay',arguments);
//	}); 
