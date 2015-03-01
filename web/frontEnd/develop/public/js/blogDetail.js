/**
 * blog detail
 *  
 */
define(function(require,exports){
    require('lib/highlight/highlight');

	var template = ['<div class="blogDetail">',
        '<div class="grid-row">',
            '<div class="grid-col-flow-300">',
                '<div class="blog_article">',
                    '<div class="caption">',
                        '<h1>${title}</h1>',
                        '<p><span>发布时间：${time_show} </span></p>',
                    '</div>',
                    '<div class="article">$${content}</div>',
                '</div>',
                '<div class="comments_frame"></div>',
            '</div>',
            '<div class="grid-col-fix-300 sidebar">',
                '<div class="side_card side-sns-share">',
                    '<div class="caption"><strong>快分享给小伙伴</strong></div>',
                    '<div class="content sns-share" data-text="${intro}" data-url="http://bh-lay.com/blog/${id}" data-title="${title}" data-img="${cover}">',
                        '<a href="#" title="新浪微博" data-shareto="weibo"><i class="l-icon l-icon-weibo"></i></a>',
                        '<a href="#" title="QQ空间" data-shareto="qzone"><i class="l-icon l-icon-qzone"></i></a>',
                    '</div>',
                '</div>',
                '[-github_links-]',
            '</div>',
        '</div>',
	'</div>'].join('');
	
	function getData(id,fn){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/blog',
			'data' : {
				'act' : 'get_detail',
				'id' : id
			},
			'success' :function(data){
                var tpl = L.tplModule(template);
				if(data.code == 1){
					var detail = data['detail'];
					var date = new Date(parseInt(detail.time_show));
					detail.time_show = (date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+ date.getDate();
					var this_html = juicer(tpl,detail);
					fn&&fn(null,this_html,data['detail']['title']);
				}else{
					fn&&fn('博客不存在！');
				}
			}
		});
	};
	
	return function(dom,id,callback){
		
		getData(id,function(err,html,title){
			if(err){
				return
			}
			callback && callback(title);
			html&&dom.html(html);
			var commentDom = dom.find('.comments_frame');
            
            //代码高亮
            dom.find('pre').each(function(){
                hljs.highlightBlock(this);
            });
            
			seajs.use('comments/index.js',function(comments){
				new comments.init(commentDom,'blog-' + id);
			});
		});
	};
});