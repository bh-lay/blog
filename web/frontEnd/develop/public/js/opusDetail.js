/**
 * opus detail
 *  
 */
define(function(require,exports){
	var showdown = require('public/js/showdown');
	function getData(id,fn){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/opus',
			'data' : {
				'act' : 'get_detail',
				'id' : id
			},
			'success' :function(data){
				if(data.code == 1){
					var converter = new showdown.converter();
					var detail = data['detail'];
					detail.content = converter.makeHtml(detail.content);
					var date = new Date(parseInt(detail.opus_time_create));
					detail.opus_time_create = (date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+ date.getDate();
                    //使用七牛图床
					detail.cover = L.qiniu(detail.cover);
					
					fn&&fn(detail,detail['title']);
				}else{
				//	L.dialog.tips('作品不存在！');
			//		L.push('/opus');
					fn&&fn();
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


		getData(id,function(detail,title){
			var this_html = juicer(base_tpl_end,detail);
			this_html&&dom.html(this_html);
			render_over&&render_over(title);
			
			var commentDom = dom.find('.comments_frame');
			seajs.use('comments/index.js',function(comments){
				new comments.init(commentDom,'opus-' + id);
			});
		});
	};
});