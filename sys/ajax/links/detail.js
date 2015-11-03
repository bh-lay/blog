/*
 * @author bh-lay
 */


var mongo = require('../../core/DB.js');

function get_detail(id,callback){
	
	var resJSON = {
		code: 200,
		id : id,
	};
	var method = mongo.start();
	method.open({
    collection_name: 'blog_friend'
  },function(err,collection){
		collection.find({
      id: id
    }).toArray(function(err, docs) {
			method.close();
			if(arguments[1].length==0){
				resJSON['code'] = 2;
				resJSON['msg'] = 'could not find this blog !';				
			}else{ 
				resJSON['detail'] = docs[0];
			}
			callback&&callback(resJSON);
		});
	});
}

module.exports = function (connect,app,id){
	var url = connect.request.url;
	app.cache.use(url,['ajax','links'],function(this_cache){
		connect.write('json',this_cache);
	},function(save_cache){

    get_detail(id,function(json_data){
			save_cache(JSON.stringify(json_data));
    });
	});
};