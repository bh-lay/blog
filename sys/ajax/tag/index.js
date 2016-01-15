/**
 * @author bh-lay
 *
 */

var getTags = require('../../functions/getTags.js');

//获取所有博文的标签
exports.allBlogTagsList = function (connect,app){
	app.cache.use('allBlogTagsList',['ajax','article','tags'],function(this_cache){
		connect.write('json',this_cache);
	},function(save_cache){
		getTags.getAllBlogTagsList(function(err,list){
			save_cache(JSON.stringify({
				code: err ? 500 : 200,
				list : list
			}));
		});
	});
}


exports.list = function (connect,app){
	app.cache.use('tagsListB',['ajax','article','tags'],function(this_cache){
		connect.write('json',this_cache);
	},function(save_cache){
		getTags.getTagsList(function(err,list){
			save_cache(JSON.stringify({
				code: err ? 500 : 200,
				list : list
			}));
		});
	});
};
