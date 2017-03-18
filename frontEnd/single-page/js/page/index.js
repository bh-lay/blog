
/**
 * render
 *
 */

//index page
define([
  'js/Base'
],function(utils){
  var temp = __inline('/tpl/index.html');

  function view(global){
    var node = global.node,
        nodeGallery;
    node.innerHTML = temp;

    nodeGallery = utils.query('.gallayer',node);

    setTimeout(function(){
      utils.addClass(nodeGallery,'zoom-show');
    },600);

    return {
      destroy: function() {
      }
    };
  }
  return view;
});
