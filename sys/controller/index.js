//author bh-lay
var temp = require('../mod/page_temp');

exports.deal = function (req,res_this){
	cache.html('index_page',function(this_cache){
		res_this.html(200,this_cache);
	},function(save_cache){
		temp.get('index',{'init':true},function(page_temp){
			save_cache(page_temp);
		});
	});
}
