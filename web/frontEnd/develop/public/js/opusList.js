/**
 * opus list
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
					list[i]['work_range'] = list[i]['work_range']?list[i]['work_range'].split(/\,/):['暂未填写'];
                    //使用七牛图床
					list[i].cover = L.qiniu(list[i].cover);
				}
				callback&&callback(list);
			}
		});
	};
	
	return function(dom,param){
		var base_tpl = $('#tpl_opus_list_base').html();
        var base_tpl_end = L.tplModule(base_tpl);
        dom.html(base_tpl_end);
		skip = 0;
		getData(function(list){
			var item_tpl = $('#tpl_opus_list_item').html();
			var this_html = juicer(item_tpl,{
				'list' : list
			});
            dom.find('.opusList').html(this_html);
		});
	};
});