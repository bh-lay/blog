/**
 * 评论 list
 *
 */
define([
    'js/Base',
    'comments/index',
    'js/juicer'
],function(utils,comments, juicer){
    var comment_id = 'define-1',
        base_tpl = __inline('/tpl/bless.html');
    var potoGraphaList = [
        {
            title: '束河古城',
            imgSrc: __uri('/images/comment_@2x.jpg'),
            htmlSrc: 'https://bh-lay.tuchong.com/14591502/',
        },
        {
            title: '西沙湿地',
            imgSrc: __uri('/images/comment_2_@2x.jpg'),
            htmlSrc: 'https://bh-lay.tuchong.com/14465332/',
        }
    ];
    var potoGraphaIndex = -1;
	function page(global){
        var base_tpl_end = L.tplModule(base_tpl),
            node = global.node;
        node.innerHTML = juicer(base_tpl_end, {
            photography: potoGraphaList[++potoGraphaIndex]
        });
        if(potoGraphaIndex + 1 >= potoGraphaList.length){
            potoGraphaIndex = -1;
        }
        var sendBox = new comments.sendBox(utils.query('.bless-sendBox',node),comment_id),
            list = new comments.list(utils.query('.grid-col-flow-300',node), comment_id);
        sendBox.on('sendToServiceSuccess',function(item){
          list.addItem(item);
        });
	}
	return page;
});
