
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
    dom.innerHTML = temp;
    var $gallery = Sizzle('.gallayer',dom)[0];
    $gallery.style.backgroundImage = 'url(' +  imgs[++index] + ')';

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
          top: Sizzle('body')[0].scrollTop - utils.offset(Sizzle('.app_container')[0]).top,
          height: window.innerHeight
        });
      }
    };
  }
  return view;
});
