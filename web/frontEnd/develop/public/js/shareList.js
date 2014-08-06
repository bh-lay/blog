/**
 * share list
 *  
 */
define(function(require,exports){
	
	var limit = 10,
		 skip = 0,
		 count = 0;
	var insert = function(param){
		var this_html = $(param['html']),
			this_dom = param['dom'];

		this_dom.html(this_html);
	};
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
	var start = function(){
		$('.shareList').on('mouseenter','a',function(){
			$(this).find('strong').stop().animate({'bottom':0},200);
		}).on('mouseleave','a',function(){
			$(this).find('strong').stop().animate({'bottom':-100},200);
		});
	};
	return function(dom,param){
		var temp = ['<li><a href="/share/<%=id %>" title="<%=title %>" lofox="true" target="_self" >',
			'<img src="<%=cover %>" alt="<%=title %>" />',
			'<strong><%=title %></strong>',
		'</a></li>'].join('');
		var render = L.tplEngine(temp);
		skip = 0;
		getData(function(list){
			dom.html('<div class="l_row"><div class="l_col_12"><ul class="shareList"></ul></div></div>');
			var this_html = '';
			
			for(var i=0,total=list.length;i<total;i++){
				//使用七牛图床
				list[i].cover = L.qiniu(list[i].cover);
				this_html += render(list[i]);
			}
			insert({
				'end' : (skip>=count)?true:false,
				'html' : this_html,
				'dom' : dom.find('.shareList')
			});
			start();
		});
	};
});