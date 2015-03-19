/**
 * opus list
 *  
 */
define(function(require,exports){
  var empty_tpl = '<div class="blank-content"><p>啥都木有</p></div>';
	
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
        if(data.code == 500){
          callback && callback(500);
          return
        }
				count = data['count'];
				skip += limit;
				
				var list = data['list'];
				for(var i = 0,total = list.length;i<total;i++){
					list[i]['work_range'] = list[i]['work_range']?list[i]['work_range'].split(/\,/):['暂未填写'];
                    //使用七牛图床
					list[i].cover = L.qiniu(list[i].cover);
				}
				callback&&callback(null,list);
			}
		});
	};
	
	return function(dom,param){
		var base_tpl = $('#tpl_opus_list_base').html();
        var base_tpl_end = L.tplModule(base_tpl);
        dom.html(base_tpl_end);
		skip = 0;
		getData(function(err,list){
      var this_html;
      if(err){
        this_html = empty_tpl;
      }else{
        var item_tpl = $('#tpl_opus_list_item').html();
        this_html = juicer(item_tpl,{
				  list : list
        });
      }
      dom.find('.opusList').html(this_html);
		});
	};
});