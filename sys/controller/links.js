//author bh-lay

exports.render = function (connect,app){
	//缓存机制
	app.cache.use('links_page',['html'],function(this_cache){
		connect.write('html',200,this_cache);
	},function(save_cache){
		//获取视图
		app.views('links',{
			'title' : '前端英雄榜_特大号的WEB屌丝们',
			'keywords' : '剧中人,程序员,前端工程师,网页设计,设计师',
			'description' : '一帮程序员,前端工程师,网页设计,设计师，一群纯屌丝！'
		},function(err,html){
			save_cache(html);
		});
	});
}
