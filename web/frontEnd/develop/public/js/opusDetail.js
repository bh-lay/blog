/**
 * opus detail
 *  
 */
define(function(require,exports){
	var template = ['<div class="opus_detail">',
    '<div class="opus_detail_header">',
        '<h1>${title}</h1>',
        '{@if cover}',
            '<div class="cover" style="background-image:url(${cover});"></div>',
        '{@/if}',
        '<div class="info">',
            '<p><strong>创作时间:</strong>${opus_time_create}</p>',
            '{@if online_url}<p><strong>相关页面:</strong><a href="${online_url}">${online_url}</a></p>{@/if}',
        '</div>',
    '</div>',           
    '<div class="grid-row">',
        '<div class="grid-col-flow-300">',
            '<div class="article">',
                '<div class="photo"><img src="${opus_pic}" alt="${title}" /></div>',
                '<div class="text">$${content}</div>',
            '</div>',
            '<div class="comments_frame"></div>',
        '</div>',
        '<div class="grid-col-fix-300 sidebar">',
            '<div class="side_card side-sns-share">',
                '<div class="caption"><strong>快分享给小伙伴</strong></div>',
                '<div class="content sns-share" data-text="${intro}" data-url="http://bh-lay.com/opus/${id}" data-title="${title}" data-img="${cover}">',
                    '<a href="#" title="新浪微博" data-shareto="weibo"><i class="l-icon l-icon-weibo"></i></a>',
                    '<a href="#" title="QQ空间" data-shareto="qzone"><i class="l-icon l-icon-qzone"></i></a>',
                '</div>',
            '</div>',
            '[-github_links-]</div>',
	'</div></div>'].join('');
	
	
	function getData(id,fn){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/opus',
			'data' : {
				'act' : 'get_detail',
				'id' : id
			},
			'success' :function(data){
				if(data.code == 1){
					var detail = data['detail'];
					var date = new Date(parseInt(detail.opus_time_create));
					detail.opus_time_create = (date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+ date.getDate();//使用七牛图床
					detail.cover = L.qiniu(detail.cover);
					
					fn&&fn(detail,detail['title']);
				}else{
				//	L.dialog.tips('作品不存在！');
			//		L.push('/opus');
					fn&&fn();
				}
			}
		});
	};
	return function(dom,id){
        var base_tpl_end = L.tplModule(template);
        
		var render_over = this.render_over || null;
		var param = param || {},
			 id = id || null;


		getData(id,function(detail,title){
			var this_html = juicer(base_tpl_end,detail);
			this_html&&dom.html(this_html);
			render_over&&render_over(title);
			
			var commentDom = dom.find('.comments_frame');
			seajs.use('comments/index.js',function(comments){
				new comments.init(commentDom,'opus-' + id);
			});
		});
	};
});