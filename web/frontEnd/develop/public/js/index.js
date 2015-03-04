
/**
 * render
 * 
 */

//index page
define(function(require,exports){
    function view(dom,callback){
        var me = this;
        var temp = $('#tpl_index_page').html();
        dom.html(temp);
	}
    view.prototype = {
        destory: function(){
        }
    };
    
	return view;
});