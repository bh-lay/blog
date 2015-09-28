
/**
 * render
 * 
 */

//index page
define(function(require,exports){
  function view(dom,callback){
    var me = this;
    var temp = __inline('/tpl/index.html');
    dom.html(temp);
  }
  return view;
});