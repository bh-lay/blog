/**
 * labs list
 *  
 */
define(function(require,exports){
	
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
		var base_tpl = $('#tpl_labs_list_base').html();
		skip = 0;
        dom.html(base_tpl);
		getData(function(list){
			var temp = $('#tpl_labs_list_item').html();
			var this_html = juicer(temp,{
                'list' : list
            });
            dom.find('.labsList').html(this_html);
		});
	};
});