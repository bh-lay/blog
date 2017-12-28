/*
 * @author bh-lay
 */


var mongo = require('../../core/DB.js');

function get_list(data,callback){
	var data = data,
		limit_num = parseInt(data['limit'])||10,
		skip_num = parseInt(data['skip'])||0;
	
	var resJSON = {
		code: 200,
		limit: limit_num,
		skip: skip_num,
	};
	
	var method = mongo.start();
	method.open({
		'collection_name': 'blog_friend'
	},function(err,collection){
      	//count the all list
		collection.count(function(err,count){
			resJSON['count'] = count;
			
			collection.find({},{
				adminScore: 0
			},{
              	limit: limit_num
            }).sort({
              	score: -1
            }).skip(skip_num).toArray(function(err, docs) {
				method.close();
				if(err){
					resJSON.code = 2;
				}else{
					resJSON['list'] = docs;
				}
				callback&&callback(resJSON);
			});
		});
	});
}

module.exports = function (connect,app){
	var url = connect.request.url;

	app.cache.use(url,['ajax','links'],function(this_cache){
      connect.write('json',this_cache);
	},function(save_cache){
      var data = connect.url.search;

      get_list(data,function(json_data){
        save_cache(json_data);
      });
	});
};