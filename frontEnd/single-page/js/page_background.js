/**
 * page background
 */
define(function () {
  'use strict';
  
  function loadImg(src, param) {
    var parm = param || {},
        loadFn = parm.loadFn || null,
        sizeFn = parm.sizeFn || null,
        errorFn = parm.errorFn || null,
        img = new Image(),
        timer;
    if (errorFn) {
      img.onerror = function () {
        errorFn();
      };
    }
    if (loadFn) {
      img.onload = function () {
        loadFn(img.width, img.height);
      };
    }
    if (sizeFn) {
      timer = setInterval(function () {
        if (img.width > 1) {
          clearInterval(timer);
          sizeFn(img.width, img.height);
        }
      }, 2);
    }
    img.src = src;
  }
  function gallery(config) {
    config = config || {};
    this.$gallery = $('<div class="gallayer"><div class="galBj"></div><div class="galMask"></div></div>').hide();
    this.$bj = this.$gallery.find('.galBj');
    this.delay = config.delay || 6000;
    this.data = config.data || [];
    this.isWebkit = L.supports.css('webkitAnimation') ? true : false;
    
    $('body').prepend(this.$gallery);
    this.$gallery.fadeIn(200);
    
    if(!config.data.length || !this.$bj){
      return;
    }
      
    this.$bj.html('');
    
    this.show(0);
  }
  gallery.prototype.show = function show(i) {
    var me = this,
        index = i,
        src = me.data[index].src,
        total = this.data.length;
    loadImg(src, {
      'loadFn' : function () {
        var newPic = $('<div class="galBj_mask"></div>');
        newPic.css({
          backgroundImage : 'url(' + src + ')'
        });
        me.$bj.html(newPic);
  
        if (!me.isWebkit) {
          newPic.hide().fadeIn(1000);
        }

        setTimeout(function () {
          me.$bj.css({'backgroundImage' : 'url(' + src + ')'});
          newPic.hide();
          index++;
          index === total && (index = 0);
          me.show(index);
        }, me.delay);
      }
    });
  };
  return gallery;
});