/**
 * 评论 list
 *
 */
define([
  'js/Base'
],function(utils){
  var comment_id = 'define-1',
      base_tpl = __inline('/tpl/bless.html');
	function page(dom){
    var base_tpl_end = L.tplModule(base_tpl);
    dom.innerHTML = base_tpl_end;

    var sendBox = new L.views.comments.sendBox(utils.query('.bless-sendBox',dom),comment_id),
        list = new L.views.comments.list(utils.query('.grid-col-flow-300',dom), comment_id);
    sendBox.on('sendToServiceSuccess',function(item){
      list.addItem(item);
    });
	}
	return page;
});
