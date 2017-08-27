
/**
 * render
 *
 */

//index page
import utils from "../Base.js";

var temp = require("html-loader!../../tpl/index.html");

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
export default view;
