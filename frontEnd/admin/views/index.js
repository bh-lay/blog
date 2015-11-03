/**
 * 博文列表页
 * @param {Object} dom
 * @param {String|Number} [id] article ID
 **/
define(function(require){
    var tpl = $('#tpl_index_page').html();

    function clear(tags){
    	var str = tags.join(',');
    	$.post('/ajax/clear_cache?type=' + str);
    	UI.prompt('已发起请求！');
    }
	function index(dom){
		var html = juicer(tpl,{
			username: admin_dataBase.username,
			cache_type: ['ajax','comment','html','labs','article','links','tags']
		});
	    dom.html(html);
	    // .cache-type-list
	    dom.on('click','.clear-cache-submit',function(){
	    	// alert(12345)
	    	var tags = [];
	    	dom.find('input[name="cache"]').each(function(){
	    		if($(this).prop('checked')){
		    		tags.push($(this).val());
				}
	    	});
	    	clear(tags);
	    });
	}
	return index;
});
