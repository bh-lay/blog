/**
 * labs list
 *  
 */
define(function(require,exports){
	require('/frontEnd/lib/juicer.js');
	require('/frontEnd/public/css/labs.css');
	
	var temp = ['{@each list as it,index}',
		'<li><div class="lab_item">',
			'<a class="lab_cover" href="/labs/${it.id}" title="${it.title}" target="_blank" style="background-image:url(${it.cover})"></a>',
			'<h4 class="lab_title">',
				'<a href="/labs/${it.id}" title="${it.title}" target="_blank">${it.title}</a>',
			'</h4>',
			'<div class="lab_info">',
				'<p>${it.intro}</p>',
			'</div>',
		'</div></li>',
	'{@/each}'].join('');
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
//		if(!param['init']){
//			return
//		}
		skip = 0;
		dom.html('<div class="l_row"><div class="labsList"><ul></ul></div></div>');
		getData(function(list){
			var this_html = juicer(temp,{'list':list}),
				this_dom = dom.find('.labsList ul');
			insert({
				'end' : (skip>=count)?true:false,
				'html' : this_html,
				'dom' : this_dom
			});
			start();
		});
	};
});