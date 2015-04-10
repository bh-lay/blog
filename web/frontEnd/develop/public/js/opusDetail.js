/**
 * opus detail
 *  
 */
define(function(require,exports){
	var showdown = require('public/js/showdown');
  var empty_tpl = '<div class="blank-content"><p>作品不存在</p></div>';
	function getData(id,fn){
		$.ajax({
			type : 'GET' ,
			url : '/ajax/opus',
			data : {
				act : 'get_detail',
				id : id
			},
			success :function(data){
				if(data.code == 200){
					var converter = new showdown.converter();
					var detail = data['detail'];
					detail.content = converter.makeHtml(detail.content);
					detail.opus_time_create = L.parseTime(detail.opus_time_create,'{y}-{mm}-{dd}');
                    //使用七牛图床
					detail.cover = L.qiniu(detail.cover);
					
					fn&&fn(null,detail,detail['title']);
				}else{
				//	L.dialog.tips('作品不存在！');
			//		L.push('/opus');
					fn&&fn('作品不存在');
				}
			}
		});
	};
	return function(dom,id){
    var template = $('#tpl_opus_detail').html();
    var base_tpl_end = L.tplModule(template);
        
		var render_over = this.render_over || null;
		var param = param || {},
			 id = id || null;


		getData(id,function(err,detail,title){
      if(err){
        dom.html(empty_tpl);
        return;
      }
			var this_html = juicer(base_tpl_end,detail);
			this_html&&dom.html(this_html);
			render_over&&render_over(title);
			
			var commentDom = dom.find('.comments_frame');
			new L.views.comments.init(commentDom,'opus-' + id);
		});
	};
});