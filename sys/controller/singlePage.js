
exports.render = function (connect,app){
	//缓存机制
	app.cache.use('singlePage',['html'],function(this_cache){
		connect.write('html',200,this_cache);
	},function(save_cache){
		//获取单页面视图
		app.views('singlePage',{
			'title' : '我的博客',
			'keywords' : '剧中人,bh-lay,网站建设,网页设计,设计师',
			'description' : '小剧客栈是剧中人精心营造的一个向广大设计爱好者、喜欢剧中人开放的博客，小剧希望用设计师鞭策自己，愿意和你共同分享，一起进步！'
		},function(err,html){
			save_cache(html);
		});
	});
}