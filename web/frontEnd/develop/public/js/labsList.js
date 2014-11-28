/**
 * labs list
 *  
 */
define(function(require,exports){
	
	var temp = ['<div class="lab_item">',
		'<a class="lab_cover" href="/labs/<%=name %>" target="_blank" title="<%=title%>">',
			'<img src="<%=cover %>" />',
		'</a>',
		'<h4 class="lab_title">',
			'<a href="/labs/<%=name %>" target="_blank" title="<%=title %>"><%=title %></a>',
		'</h4>',
		'<div class="lab_info">',
			'<p><%=intro %></p>',
		'</div>',
	'</div>'].join('');
	
	var render = L.tplEngine(temp);
	var limit = 20,
		 skip = 0,
		 count = null,
		 dom;
	var getData = function(callback){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/labs',
			'data' : {
				'act' : 'get_list',
				'skip' : skip ,
				'limit' : limit
			},
			'success' :function(data){
				count = data['count'];
				skip += limit;
				
				var list = data['list'];
				for(var i = 0,total = list.length;i<total;i++){
					list[i]['work_range'] = list[i]['work_range']?list[i]['work_range'].split(/\,/):['暂未填写'];
					//使用七牛图床
					list[i].cover = L.qiniu(list[i].cover,{
						'type' : 'cover',
						'width' : 320,
						'height': 240
					});
				}
				callback&&callback(list);
			}
		});
	};
	return function(dom,param){
		skip = 0;
		getData(function(list){
			dom.html('<div class="labsList"></div>');
			var this_html = '';
			for(var i=0,total=list.length;i<total;i++){
				this_html += render(list[i]);
			}
            dom.find('.labsList').append(this_html);
		});
	};
});