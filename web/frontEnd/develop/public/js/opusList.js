/**
 * opus list
 *  
 */
define(function(require,exports){
	
	var item_tpl = ['<li>',
		'<a href="/opus/<%=id %>" title="<%=title %>" target="_self" lofox="true" class="opus_cover" >',
			'<img src="<%=cover %>" alt="<%=title %>" />',
		'</a>',
		'<div class="opus_info">',
			'<h3><a href="/opus/<%=id %>" target="_self" lofox="true" ><%=title %></a></h3>',
			'<p><strong>开发范围：</strong>',
				'<% for(var i=0;i<work_range.length;i++){ %>',
					'<span><%=work_range[i] %></span>',
				'<% } %>',
			'</p>',
			'<p><strong>在线地址：</strong>',
				'<% if(online_url){ %>',
					'<a href="<%=online_url %>"><%=online_url %></a>',
				'<% }else{ %>',
					'<span>无在线地址</span>',
				'<% } %>',
			'</p>',
		'</div>',
	'</li>'].join('');
	var render = L.tplEngine(item_tpl);
	
	var limit = 20,
		 skip = 0,
		 count = null,
		 dom;

	var insert = function(param){
		var this_html = $(param['html']),
			this_dom = param['dom'];
		this_dom.append(this_html);
	};
	var getData = function(callback){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/opus',
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
					list[i]['work_range'] = list[i]['work_range']?list[i]['work_range'].split(/\,/):['暂未填写'];//使用七牛图床
					list[i].cover = L.qiniu(list[i].cover);
				}
				callback&&callback(list);
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
		var render_over = this.render_over || null;
		skip = 0;
		getData(function(list){
			dom.html('<div class="golCnt"><div class="opusList"><ul></ul></div></div>');
			var this_html = '',
				this_dom = dom.find('.opusList ul');
			
			for(var i=0,total=list.length;i<total;i++){
				this_html += render(list[i]);
			}
			insert({
				'end' : (skip>=count)?true:false,
				'html' : this_html,
				'dom' : this_dom
			});
			start();
			render_over&&render_over();
		});
	};
});