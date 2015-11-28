
/**
 * render
 *
 */

//index page
define(function(require,exports){
  var temp = __inline('/tpl/index.html'),
      imgs = [
        __uri("/images/gallery/bamboo.jpg"),
        __uri("/images/gallery/coast.jpg")
      ],
      index=-1;

  function view(dom){
    var $gallery = dom.html(temp).find('.gallayer');
    $gallery.css('backgroundImage','url(' +  imgs[++index] + ')');

    if(index + 1 >= imgs.length){
      index = -1;
    }
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
