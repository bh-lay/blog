
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

  function view(global){
    var node = global.node,
        nodeGallery;
    node.innerHTML = temp;

    nodeGallery = utils.query('.gallayer',node);
    nodeGallery.style.backgroundImage = 'url(' +  imgs[++index] + ')';

    if(index + 1 >= imgs.length){
      index = -1;
    }
    setTimeout(function(){
      // utils.addClass(nodeGallery,'zoom-show');
      nodeGallery.style.display = 'block';
    },600);

// wedding
    function leftZeroPad(val, minLength) {
      if (typeof(val) != "string")
        val = String(val);
      return (MANY_ZEROS.substring(0, minLength - val.length)) + val;
    }
    function createCountDownHtml( str ){
      var arr = str.match(/./g),
        html = '';
      arr.forEach(function( num ){
        html += '<span>' + num + '</span>';
      });
      return html + '<strong>天</strong>';
    }
    var countDownDays = Math.ceil( ( new Date(2016,9-1,28) - new Date() )/1000/60/60/24 ),
        MANY_ZEROS = "000000000000000000",
        str_day = leftZeroPad(countDownDays,3);

    if( countDownDays < 0 ){
      utils.query('.countdown').style.display = 'none';
    }else{
      utils.query('.countdown-body',node).innerHTML = countDownDays == 0 ? '<span>婚</span><span>礼</span><span>中</span>' : createCountDownHtml( str_day ); 
    }
    utils.css( utils.query('.index-wedding',node), {
      height: window.innerHeight - 50
    });
// wedding

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
