
/**
 * render
 * 
 */

//index page
define(function(require,exports){
  function view(dom,callback){
    var me = this;
    this.dom = dom;
    var temp = __inline('/tpl/index.html');
    dom.html(temp);
    this.$gallery = dom.find('.gallayer');
    setTimeout(function(){
    	me.$gallery.show();
    },600);
  }
  view.prototype.destroy = function() {
  	this.$gallery.css({
  		position: 'absolute',
  		top: $(window).scrollTop() - $('.app_container').offset().top,
  		height: $(window).height()
  	});
  };
  return view;
});