/**
 * 评论 list
 *  
 */
define(function(require,exports){
    var base_tpl = ['<div class="grid-row blessPage">',
        '<div class="grid-col-flow-300"></div>',
        '<div class="grid-col-fix-300 sidebar">',
            '[-github_links-][-latest_comments-]',
        '</div>',
    '</div>'].join('');
	function page(dom){
        var base_tpl_end = L.tplModule(base_tpl);
        
        dom.html(base_tpl_end);
        new L.views.comments.init(dom.find('.grid-col-flow-300')[0], 'define-1');
	}
	return page;
});