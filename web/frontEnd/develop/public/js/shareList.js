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
		var temp = ['{@each list as it}<li>',
			'<a href="/share/${it.id}" title="${it.title}" lofox="true" class="shareItem_cover" target="_self" >',
				'<img src="${it.cover}" alt="${it.title}" />',
			'</a>',
			'<a href="/share/${it.id}" title="${it.title}" lofox="true" class="shareItem_title" target="_self" ><strong>${it.title}</strong></a>',
			'<p>${it.intro}</p>',
		'</li>{@/each}'].join('');
		skip = 0;
		getData(function(list){
			dom.html('<div class="shareList"><ul></ul></div>');
			
			for(var i=0,total=list.length;i<total;i++){
				//使用七牛图床
				list[i].cover = L.qiniu(list[i].cover);
			}
			var this_html = juicer(temp,{
                'list' : list
            });
            
            dom.find('.shareList ul').html(this_html);
		});
	};
});