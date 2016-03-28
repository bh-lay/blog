
var mongo = require('../core/DB.js'),
	github = require('./github.js');

//获取实验室列表
function get_list(callback){
	var method = mongo.start(),
		list = [];
	method.open({
		'collection_name': 'labs'
	},function(err,collection){
		if(err){
			callback && callback(list);
			return
    	}
		collection.find({}).toArray(function(err, docs) {
			method.close();
			if(!err){
				docs.forEach(function(item,index){
					var repo = item.git_full_name;
					if(repo.length > 2){
						list.push({
							repo: repo,
							id: item.id
						});
					}
				});
			}
			callback&&callback(list);
		});
	});
}
//从Github API获取数据
function get_info(repo_name,callback){
	var need_keys = "name,full_name,html_url,description,created_at,updated_at,pushed_at,git_url,homepage,stargazers_count,watchers_count,forks_count".split(','),
		repo_info = {};
		
	github.getReposInfo(repo_name,function(err,data){
		if(err){
			callback && callback(err);
			return
		}
		need_keys.forEach(function(item){
			repo_info[item] = data[item];
		});
		callback && callback(null,repo_info);
	});
}
//更新实验室单条数据
function update(id,data,callback){
	var method = mongo.start()
	method.open({
		collection_name: 'labs'
	},function(err,collection){
		collection.update({
			id: id
		}, {
			$set: {
				github: data
			}
		}, function(err) {
			if(err) {
				callback && callback(err);
			}else {
				callback && callback(null);
			}
			method.close();
		});
	});
}

exports.all = function(){
	get_list(function(list){
		list.forEach(function(item,index){
			var repo_name = item.repo,
				id = item.id;
			//隔两秒执行一条
			setTimeout(function(){
				get_info(repo_name,function(err,data){
					if(err){
						return;
					}
					//更新数据
					update(id,data);
				});
			},index * 2000);
		});
	});
};
exports.item = function(repo_name,id,callback){
	get_info(repo_name,function(err,data){
		if(err){
			callback && callback('err');
			return;
		}
		//更新数据
		update(id,data,callback);
	});
};