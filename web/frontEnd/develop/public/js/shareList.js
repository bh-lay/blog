/**
 * share list
 *  
 */
define(function(require,exports){
	
	var limit = 10,
		 skip = 0,
		 count = 0;
	var getData = function(fn){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/share',
			'data' : {
				'act' : 'get_list',
				'skip' : skip ,
				'limit' : limit
			},
			'success' :function(data){
				count = data['count'];
				skip += limit;
				
				var list = data['list'];
				fn&&fn(list);
			}
		});
	};
	return function(dom,param){
		var temp = ['<li>',
			'<a href="/share/<%=id %>" title="<%=title %>" lofox="true" class="shareItem_cover" target="_self" >',
				'<img src="<%=cover %>" alt="<%=title %>" />',
			'</a>',
			'<a href="/share/<%=id %>" title="<%=title %>" lofox="true" class="shareItem_title" target="_self" ><strong><%=title %></strong></a>',
			'<p><%= intro %></p>',
		'</li>'].join('');
		var render = L.tplEngine(temp);
		skip = 0;
		getData(function(list){
			dom.html('<div class="shareList"><ul></ul></div>');
			var this_html = '';
			
			for(var i=0,total=list.length;i<total;i++){
				//使用七牛图床
				list[i].cover = L.qiniu(list[i].cover);
				this_html += render(list[i]);
			}
            
            dom.find('.shareList ul').html(this_html);
		});
	};
});