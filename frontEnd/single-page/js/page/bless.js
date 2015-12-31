/**
 * 评论 list
 *
 */
define([
  'js/Base',
  'comments/index'
],function(utils,comments){
  var comment_id = 'define-1',
      base_tpl = __inline('/tpl/bless.html');
	function page(global){
    var base_tpl_end = L.tplModule(base_tpl),
        node = global.node;
    node.innerHTML = base_tpl_end;

    var sendBox = new comments.sendBox(utils.query('.bless-sendBox',node),comment_id),
        list = new comments.list(utils.query('.grid-col-flow-300',node), comment_id);
    sendBox.on('sendToServiceSuccess',function(item){
      list.addItem(item);
    });
	}
	return page;
});
