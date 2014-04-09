/*
 * @author bh-lay
 * view url : /blog    /blog/
 */
var views = require('../mod/views');
var component = require('../mod/component');

exports.deal = function (req,res_this,path){
	var path_length = path['pathnode'].length;
	if(path_length == 1){
		cache.html('blog_list',function(this_cache){
			//do something with this_cache
			res_this.html(200,this_cache);
		},function(save_cache){
			//if none of cache,do this Fn
			//获取视图
			views.get('blogList',{
				'title' : '我的博客',
				'keywords' : '剧中人,bh-lay,网站建设,网页设计,设计师',
				'description' : '小剧客栈是剧中人精心营造的一个向广大设计爱好者、喜欢剧中人开放的博客，小剧希望用设计师鞭策自己，愿意和你共同分享，一起进步！'
			},function(err,html){
				save_cache(html);
			});
		}); 
	}else if(path_length == 2){
		var id = path['pathnode'][1];
		
		//获取博客列表信息
		component.get('blogDetail',{
			'id' : id
		},function(err,blog_detail_html,data){
			cache.html('blog_id_' + id,function(this_cache){
				res_this.html(200,this_cache);
			},function(save_cache){
				//获取视图
				views.get('singlePage',{
					'title' : data.title,
					'keywords' : data.tags,
					'description' : data.intro,
					'sourceCode' : blog_detail_html
				},function(err,html){
					save_cache(html);
				});
			});
		});
	}else{
		res_this.notFound('小盆友，表逗我玩儿！');
	}
}