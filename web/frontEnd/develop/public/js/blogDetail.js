/**
 * blog detail
 *  
 */
define(function(require,exports){
	require('lib/juicer.js');
    require('lib/highlight/highlight.pack.js');

	var template = ['<div class="blogDetail">',
		'<div class="blog_article">',
			'<div class="articletop">',
				'<h1>${title}</h1>',
				'<p><span>发布时间：${time_show} </span></p>',
			'</div>',
			'<div class="article">$${content}</div>',
		'</div>',
		'<div class="comments_frame"></div>',
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
				if(data.code == 1){
					var detail = data['detail'];
					var date = new Date(parseInt(detail.time_show));
					detail.time_show = (date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+ date.getDate();
					var this_html = juicer(template,detail);
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