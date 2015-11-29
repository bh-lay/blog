/**
 * 评论 list
 *
 */
define(function(require,exports){
  var comment_id = 'define-1',
      base_tpl = __inline('/tpl/bless.html');
	function page(dom){
    var base_tpl_end = L.tplModule(base_tpl);
    dom.html(base_tpl_end);
    new L.views.comments.sendBox(dom.find('.bless-sendBox')[0],comment_id);
    new L.views.comments.list(dom.find('.grid-col-flow-300')[0], comment_id);
	}
	return page;
});
