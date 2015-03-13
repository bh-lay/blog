/**
 * blog detail
 *  
 */
define(function(require,exports){
    require('lib/highlight/highlight');
	var showdown = require('public/js/showdown');
	
	function getData(id,fn){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/blog',
			'data' : {
				'act' : 'get_detail',
				'id' : id
			},
			'success' :function(data){
                var template = $('#tpl_blog_detail').html();
                var tpl = L.tplModule(template);
				if(data.code == 1){
					var converter = new showdown.converter();
					var detail = data['detail'];
					var date = new Date(parseInt(detail.time_show));
					detail.content = converter.makeHtml(detail.content);
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