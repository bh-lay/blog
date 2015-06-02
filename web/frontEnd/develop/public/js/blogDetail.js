/**
 * blog detail
 *  
 */
define(function(require,exports){
  require('lib/highlight/highlight');
	var showdown = require('public/js/showdown');
  var empty_tpl = '<div class="blank-content"><p>博文不存在</p></div>';
	
	function getData(id,fn){
		$.ajax({
			type : 'GET' ,
			url : '/ajax/blog',
			data : {
				act : 'get_detail',
				id : id
			},
			success :function(data){
        var template = $('#tpl_blog_detail').html();
        var tpl = L.tplModule(template);
				if(data.code == 200){
					var converter = new showdown.converter();
					var detail = data['detail'];
					detail.content = converter.makeHtml(detail.content);
					detail.time_show = L.parseTime(detail.time_show,'{y}-{mm}-{dd}');
					var this_html = juicer(tpl,detail);
					fn&&fn(null,this_html,data['detail']['title']);
				}else{
					fn&&fn('博客不存在！');
				}
			}
		});
	};
	
	return function(dom,id,callback){
		
		getData(id,function(err,html,title){
			if(err){
        dom.html(empty_tpl);
				return
			}
			callback && callback(title);
			html&&dom.html(html);
			var commentDom = dom.find('.comments_frame');
      
      //代码高亮
      dom.find('pre').each(function(){
          hljs.highlightBlock(this);
      });
      
			new L.views.comments.init(commentDom,'blog-' + id,{
        list_num: 8
      });
		});
	};
});