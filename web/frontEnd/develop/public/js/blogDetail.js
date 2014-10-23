/**
 * blog detail
 *  
 */
define(function(require,exports){
	require('lib/juicer.js');

	var template = ['<div class="blog_article">',
		'<div class="l_row">',
		'<div class="articletop">',
			'<h1>${title}</h1>',
			'<p><span>时间：${time_show} </span><span>作者：${author}</span></p>',
		'</div>',
		'<div class="article">$${content}</div>',
		'<div class="copylink">',
			'<div class="tag"><strong>本文关键字：</strong>${tags}</div>',
			'<div class="pageUrl"><strong>转载请注明来源：</strong>http://bh-lay.com/blog/${id}</div>',
		'</div>',
		'</div>',
		'<div class="comments_frame"><div class="l_row"></div></div>',
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
			seajs.use('comments/index.js',function(comments){
				new comments.init(commentDom.find('.l_row'),'blog-' + id);
			});
		});
	};
});