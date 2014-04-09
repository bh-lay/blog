//author bh-lay
var views = require('../mod/views');

exports.deal = function (req,res_this){
	//缓存机制
	cache.html('index_page',function(this_cache){
		res_this.html(200,this_cache);
	},function(save_cache){
		//获取视图
		views.get('indexPage',{
			'title' : '首页',
			'keywords' : '剧中人,bh-lay,网站建设,网页设计,设计师',
			'description' : '小剧客栈是剧中人精心营造的一个向广大设计爱好者、喜欢剧中人开放的博客，小剧希望用设计师鞭策自己，愿意和你共同分享，一起进步！'
		},function(err,html){
			save_cache(html);
		});
	});
}
