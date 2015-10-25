
/**
 * render
 * 
 */

//index page
define(function(require,exports){
  var temp = __inline('/tpl/index.html');

  function view(dom){
    var $gallery;
    
    dom.html(temp);
    $gallery = dom.find('.gallayer');

    setTimeout(function(){
      $gallery.addClass('zoom-show');
    },600);

    return {
      destroy: function() {
        $gallery.css({
          position: 'absolute',
          top: $(window).scrollTop() - $('.app_container').offset().top,
          height: $(window).height()
        });
      }
    };
  }
  return view;
});