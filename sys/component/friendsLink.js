/*
 * @author bh-lay
 *
 */

var utils = require('../core/utils/index.js');
var mongo = require('../core/DB');

exports.produce = function(temp,data,callback){
	var method = mongo.start();
	method.open({'collection_name':'blog_friend'},function(err,collection){
		collection.find({
            isShow: '1'
        }, {limit:20}).toArray(function(err, docs) {
			if(err){
				callback && callback(err);
				return
			}
			var html = utils.juicer(temp,{
				'list': docs
			});
			
			callback && callback(null,html);
			method.close();
		});
	});
};