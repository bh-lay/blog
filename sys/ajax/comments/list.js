
var mongo = require('../../lofox/DB.js');

//获取评论列表
module.exports = function(data,callback){
	var data = data,
		limit_num = parseInt(data['limit']) || 10,
		skip_num = parseInt(data['skip']) || 0;
	
	var resJSON = {
		'limit':limit_num,
		'skip':skip_num,
	};
	
	var method = mongo.start();
	method.open({'collection_name':'comments'},function(err,collection){
    //count the all list
		collection.count(function(err,count){
			resJSON['count'] = count;
			
			collection.find({},{limit:limit_num}).sort({id:-1}).skip(skip_num).toArray(function(err, docs) {
				method.close();
				if(err){
					callback&&callback(err);
				}else{
					docs.forEach(function(item){
						item.uid = item.uid || '123';
					});
				
					resJSON['list'] = docs;
					callback&&callback(null,resJSON);
				}
			});
		});
	});
};