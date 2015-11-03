/**
 * 博文列表页
 * @param {Object} dom
 * @param {String|Number} [id] article ID
 **/
define(function(require){
    var tpl = $('#tpl_index_page').html();

	function index(dom){
		var html = juicer(tpl,{
			username: admin_dataBase.username,
			cache_type: ['ajax','comment','html','labs','article','links','tags']
		});
	    dom.html(html);
	}
	return index;
});
