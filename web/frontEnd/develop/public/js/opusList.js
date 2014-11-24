/**
 * opus list
 *  
 */
define(function(require,exports){
	
	var item_tpl = ['{@each list as it}<li>',
		'<a href="/opus/${it.id}" title="${it.title}" target="_self" lofox="true" class="opus_cover" >',
			'<img src="${it.cover}?imgView/1/w/100/h/100/85" alt="${it.title}" />',
		'</a>',
		'<div class="opus_info">',
			'<h3><a href="/opus/${it.id}" target="_self" lofox="true" >${it.title}</a></h3>',
			'<p><strong>开发范围：</strong>',
				'{@each it.work_range as key }',
					'<span>${key}</span>',
				'{@/each}',
			'</p>',
			'<p><strong>在线地址：</strong>',
				'{@if it.online_url}',
					'<a href="${it.online_url}">${it.online_url}</a>',
				'{@else}',
					'<span>无在线地址</span>',
				'{@/if}',
			'</p>',
		'</div>',
	'</li>{@/each}'].join('');
	
	var limit = 20,
		 skip = 0,
		 count = null,
		 dom;
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
	
	return function(dom,param){
		skip = 0;
		getData(function(list){
			dom.html('<div class="opusList"><ul></ul></div>');
			var this_html = juicer(item_tpl,{
				'list' : list
			});
            dom.find('ul').append(this_html);
		});
	};
});