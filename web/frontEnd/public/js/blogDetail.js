/**
 * blog detail
 *  
 */
define(function(require,exports){
	require('/frontEnd/lib/juicer.js');
	require('/frontEnd/public/css/blog.css');

	var template = ['<div class="golCnt"><div class="article">',
		'<div class="articletop">',
			'<h1>${title}</h1>',
			'<p><span>时间：${time_show} </span><span>作者：${author}</span></p>',
		'</div>',
		'{@if cover}<img src="${cover}" alt="${title}" class="topicImg" />{@/if}',
		'<div class="text md_html">$${content}</div>',
		'<div class="copylink">',
			'<div class="tag"><strong>本文关键字：</strong>${tags}</div>',
			'<div class="pageUrl"><strong>转载请注明来源：</strong>http://bh-lay.com/blog/${id}</div>',
		'</div>',
		'<div class="youyan">',
			'<div id="uyan_frame"></div>',
			'<script type="text/javascript">',
				'var uyan_config = {"du":"bh-lay.com"};',
			'</script>',
			'<script type="text/javascript" id="UYScript" src="http://v1.uyan.cc/js/iframe.js?UYUserId=1605927" async=""></script>',
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
				if(data.code == 1){
					var detail = data['detail'];
					var date = new Date(parseInt(detail.time_show));
					detail.time_show = (date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+ date.getDate();
					var this_html = juicer(template,detail);
					fn&&fn(this_html,data['detail']['title']);
				}else{
					L.dialog.tips('博客不存在！');
					lofox.push('/blog',{render:false});
					fn&&fn();
				}
			}
		});
	};
	
	return function(dom,param){
		var param = param || {},
			 id = param['id'] || null,
			 render_over = this.render_over || null;
		getData(id,function(html,title){
			html&&dom.html(html);
			render_over&&render_over(title);
		});
		
	};
});