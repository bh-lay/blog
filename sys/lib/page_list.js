/**
 * @author bh-lay
 */

/*
  @demo
	var a = page({
 		list_count:100,
		page_cur:1,
		page_list_num:6,
		url_base:'/admin/main/articleList.html'
	 });
 */

exports.render = function (parm){
	var parm = parm || {},
	list_count = parm.list_count || 0,
	page_cur = parm.page_cur || 1,
	page_list_num = parm.page_list_num || 15,
	page_num = Math.ceil(list_count / page_list_num),
	url_base = parm['url_base']||'';
	
	if(page_num==1||url_base.length<2){return '';}
	var txt = '';
	if (page_cur > 1) {
		txt += '<a href="' + url_base + '?' + (page_cur - 1) + '" >上一页</a>';
	}else{
		txt += '<span>上一页</span>';
	}
	for (var i = 0; i < page_num; i++) {
		if(i+1!=page_cur){
			txt += '<a target="_self" href="' + url_base + '?' + (i + 1) + '">' + (i + 1) + '</a>';
		}else{
			txt += '<b>'+ (i + 1) +'</b>'
		}
	}
	if (page_num - page_cur >= 1) {
		txt += '<a href="' + url_base + '?' + (page_cur + 1) + '">下一页</a>';
	}else{
		txt += '<span>下一页</span>';
	}
	return '<div class="pageList">'+txt+'</div>'
}
