
/**
 * render
 *
 */

//index page
define([
  'js/Base'
],function(utils){
  var temp = __inline('/tpl/index.html'),
      imgs = [
        __uri("/images/gallery/bamboo.jpg"),
        __uri("/images/gallery/coast.jpg")
      ],
      index=-1;

  function view(dom){
    dom.innerHTML = temp;
    var nodeGallery = utils.query('.gallayer',dom);
    nodeGallery.style.backgroundImage = 'url(' +  imgs[++index] + ')';

    if(index + 1 >= imgs.length){
      index = -1;
    }
    setTimeout(function(){
      utils.addClass(nodeGallery,'zoom-show');
    },600);

    return {
      destroy: function() {
        utils.css(nodeGallery,{
          position: 'absolute',
          top: utils.query('body').scrollTop - utils.offset(utils.query('.app_container')).top,
          height: window.innerHeight
        });
      }
    };
  }
  return view;
});
