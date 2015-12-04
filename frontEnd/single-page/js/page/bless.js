/**
 * 评论 list
 *
 */
define(function(require,exports){
  var comment_id = 'define-1',
      base_tpl = __inline('/tpl/bless.html');
	function page(dom){
    var base_tpl_end = L.tplModule(base_tpl);
    dom.innerHTML = base_tpl_end;
    new L.views.comments.sendBox(Sizzle('.bless-sendBox',dom)[0],comment_id);
    new L.views.comments.list(Sizzle('.grid-col-flow-300',dom)[0], comment_id);
	}
	return page;
});
