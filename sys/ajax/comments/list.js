
var mongo = require('../../lofox/DB.js');


function getUserInfo(id,callback){
	var method = mongo.start();
	method.open({'collection_name':'user'},function(err,collection){
		if(err){
			callback && callback(err);
			return;
		}
		collection.find({'id' : id}).toArray(function(err, docs) {
			method.close();
			if(err || docs.length == 0){
				callback && callback(err);
				return;
			}
			delete docs[0]['password'];
			callback && callback(null,docs[0]);
		});
	});
}


//获取评论列表
module.exports = function(data,callback){
	var data = data,
		id = data['id'],
		limit_num = parseInt(data['limit']) || 10,
		skip_num = parseInt(data['skip']) || 0;
	
	var resJSON = {
		'limit':limit_num,
		'skip':skip_num,
	};
	
	var method = mongo.start();
	method.open({'collection_name':'comments'},function(err,collection){
			
		collection.find({'id' : id},{limit:limit_num}).sort({time:-1}).skip(skip_num).toArray(function(err, docs) {
			//count the all list
			collection.count({'id' : id},function(err,count){
				resJSON['count'] = count;
				
				method.close();
				if(err){
					callback&&callback(err);
				}else{
					var users = {};
					var uidsLength = 0;
					var overLength = 0;
					//获取所有需要的用户id
					docs.forEach(function(item){
						if(item.uid){
							users[item.uid] = {};
						}
					});
					//遍历所有需要的用户id
					for(var key in users){
						uidsLength++;
						//获取用户信息
						getUserInfo(key,function(err,userInfo){
							overLength++;
							if(!err){
								users[key] = userInfo;
							}
							if(overLength == uidsLength){
								docs.forEach(function(item){
									item.user = users[item.uid] || {};
								});
							
								resJSON['list'] = docs;
								callback&&callback(null,resJSON);
							}
						});
					}
					
				
				}
			});
		});
	});
};