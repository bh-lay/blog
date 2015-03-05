/**
 * labs list
 *  
 */
define(function(require,exports){
	
	var temp = ['<div class="grid-row">{@each list as it}<div class="grid-box">',
        '<a href="/labs/${it.name}" title="${it.title}" class="lab_item">',
            '<div class="cover" style="background-image:url(${it.cover})"><i class="l-icon l-icon-link"></i></div>',
            '<div class="info">',
                '<h4 class="title">${it.title}</h4>',
                '<p>${it.intro}</p>',
            '</div>',
	   '</a>',
    '</div>{@/each}</div>'].join('');
	
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
						'height': 400
					});
				}
				callback&&callback(list);
			}
		});
	};
	return function(dom,param){
		skip = 0;
        dom.html('<div class="labsList"><div class="l-loading-panel"><span class="l-loading"></span><p>正在加载数据</p></div></div>');
		getData(function(list){
			var this_html = juicer(temp,{
                'list' : list
            });
            dom.find('.labsList').html(this_html);
		});
	};
});