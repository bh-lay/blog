
var mongo = require('../core/DB.js'),
	github = require('./github.js'),
	collection_name = 'cache',
	mongon_ID = 'github_bh-lay',
	need_keys = "public_repos,followers,following".split(',');


//从数据库读取
function getFromDataBase(callback){
	var method = mongo.start();
	method.open({
		collection_name: collection_name
	},function(err,collection){
		if(err){
			callback && callback(err);
			return;
		}
		collection.find({
			id : mongon_ID
		}).toArray(function(err, docs) {
			method.close();
			if(arguments[1].length==0){
				//若不存在，则从 Github 上获取
				updateFromGithub(function(err,data){
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
	var method = mongo.start();

	data.id = mongon_ID;

	method.open({
    	collection_name: collection_name
  	},function(error,collection){
  		//查询用户信息
  		collection.find({
			id : mongon_ID
		})
		//计算条数
		.count(function(err,count){
  			if(count > 0){
				// 条数存在，则直接更新
				collection.update({
					id: mongon_ID
				}, {
					$set: data
				}, function(err,docs) {
					method.close();
				});
  			}else{
  				// 不存在则插入为新数据
				collection.insert(data,function(err,result){
					method.close();
				});
  			}
  		});
	});
}

//从Github API更新数据
function updateFromGithub(callback){
	github.getUserInfo('bh-lay',function(err,info){
		var data = {};
		need_keys.forEach(function(item){
			data[item] = info[item];
		});
		callback && callback(null,data);
		//保存到数据库
		saveDataToDataBase(data);
	});
}

exports.update = updateFromGithub;
exports.get = getFromDataBase;