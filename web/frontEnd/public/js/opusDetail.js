/**
 * opus detail
 *  
 */
define(function(require,exports){
	require('/frontEnd/lib/juicer.js');
	require('/frontEnd/public/css/opus.css');
	var template = ['<div class="golCnt">',
		'<div class="TagLine">小剧作品，一次次小小的进步，成就平凡的自己！</div>',
		'<div id="focusTitle">',
			'{@if cover}',
				'<img src="${cover}" alt="${title}" class="topicImg" />',
			'{@/if}',
			'<div class="info">',
				'<h1>${title}</h1>',
				'<ul>',
					'<li><strong>创作时间:</strong>${opus_time_create}</li>',
					'<li><strong>相关页面:</strong><a href="#" title="字段暂无" target="_blank">字段暂无</a></li>',
				'</ul>',
			'</div>',
		'</div>',
		'<div class="opus_detail">',
			'<div class="photo"><img src="${opus_pic}" alt="${title}" /></div>',
			'<div class="text">$${content}</div>',
			'<div class="youyan"><!-- UY BEGIN -->',
				'<div id="uyan_frame"></div>',
				'<script type="text/javascript" id="UYScript" src="http://v1.uyan.cc/js/iframe.js?UYUserId=1605927" async=""></script>',
			'<!-- UY END --></div>',
		'</div>',
	'</div>'].join('');
	
	
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
					detail.opus_time_create = (date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+ date.getDate();
					
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
		var render_over = this.render_over || null;
		var param = param || {},
			 dom = dom || $('.contlayer'),
			 id = id || null;


		getData(id,function(detail,title){
			var this_html = juicer(template,detail);
			this_html&&dom.html(this_html);
			render_over&&render_over(title);
		});
	};
});