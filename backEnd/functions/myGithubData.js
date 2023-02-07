
var DB = require('../core/DB.js'),
	github = require('./github.js'),
	collection_name = 'cache',
	mongon_ID = 'github_bh-lay',
	need_keys = 'public_repos,followers,following'.split(',')


// 从数据库读取
function getFromDataBase(callback){
	DB.getCollection(collection_name)
		.then(({collection, client}) => {
			collection.find({
				id : mongon_ID
			}).toArray(function(err, docs) {
				client.close()
				if(arguments[1].length==0){
					// 若不存在，则从 Github 上获取
					updateFromGithub(function(err,data){
						callback && callback(err,data)
					})
				}else{
					callback&&callback(null,docs[0])
				}
			})
		}).catch(() => {
			callback && callback('error')
		})
}
// 保存到数据库
function saveDataToDataBase(data){
	DB.getCollection(collection_name)
		.then(({collection, client}) => {
			// 计算条数
			collection.countDocuments({
				id : mongon_ID
			}, function(err,count){
				if(count > 0){
					// 条数存在，则直接更新
					collection.updateOne({
						id: mongon_ID
					}, {
						$set: data
					}, function() {
						client.close()
					})
				}else{
					// 不存在则插入为新数据
					collection.insertOne(data,function(){
						client.close()
					})
				}
			})
		})
		.catch(e => console.log(e))
}

// 从Github API更新数据
function updateFromGithub(callback){
	github.getUserInfo('bh-lay',function(err,info){
		var data = {}
		need_keys.forEach(function(item){
			data[item] = info[item]
		})
		callback && callback(null,data)
		// 保存到数据库
		saveDataToDataBase(data)
	})
}

exports.update = updateFromGithub
exports.get = getFromDataBase