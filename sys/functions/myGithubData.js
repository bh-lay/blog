
var request = require('request'),
	mongo = require('../core/DB.js'),
	collection_name = 'cache',
	mongon_key = 'github_bh-lay',
	need_keys = "public_repos,followers,following".split(',');
	


//从数据库读取
function getFromDataBase(callback){
	// console.log('getFromDataBase');
	var method = mongo.start();
	method.open({
		collection_name: collection_name
	},function(err,collection){
		if(err){
			callback && callback(err);
			return;
		}
		collection.find({
			id : mongon_key
		}).toArray(function(err, docs) {
			method.close();
			console.log('docs',docs);
			if(arguments[1].length==0){
				//若不存在，则从 Github 上获取
				getFromGithub(function(err,data){
					callback && callback(err,data);
				});
			}else{
				callback&&callback(null,docs[0]);
			}
		});
	});
}
//保存到数据库
function saveDataToDataBase(data){
	// console.log('saveDataToDataBase');
	var method = mongo.start();

	data.id = mongon_key;

	method.open({
    	collection_name: collection_name
  	},function(error,collection){

  		collection.find({
			id : mongon_key
		}).count(function(err,count){
  			if(count > 0){
				collection.update({
					id: mongon_key
				}, {
					$set: data
				}, function(err,docs) {
					method.close();
				});
  			}else{
				collection.insert(data,function(err,result){
					method.close();
				});
  			}
  		});
	});
}
//从Github API获取数据
function getFromGithub(callback){
	request({
		url: 'https://api.github.com/users/bh-lay',
		headers: {
			'User-Agent': 'bh-lay github api robots'
		}
	}, function (err, response, body){
		var responseBody;
		console.log(err, response.statusCode, body);
		if(err,response.statusCode != 200){
			callback && callback('error');
			return;
		}
		responseBody = JSON.parse(body);
		var data = {};
		need_keys.forEach(function(item){
			data[item] = responseBody[item];
		});
		callback && callback(null,data);
		//保存到数据库
		saveDataToDataBase(data);
	});
}

exports.update = getFromGithub;
exports.get = getFromDataBase;