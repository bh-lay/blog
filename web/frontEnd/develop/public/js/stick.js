(function(global,doc,$,factory){
  var Stick = factory(global,doc,$);
  //exports for commonJS
  global.Stick = global.Stick || Stick;
  global.define && define(function(require,exports){
      return Stick;
  });
})(window,document,jQuery,function(window,document,$){
  function loadImg(src,callback){
    if(!src){
      callback && callback();
      return;
    }
    var img = new Image();
    function End(){
      clearInterval(timer);
      callback && callback();
      callback = null;
    }
    img.onerror = End;
    img.onload = End;
    var timer = setInterval(function(){
      img.width>1 && End();
    },2);
    img.src=src;
  }
  
  function Stick(param){
    var param = param || {},
        me = this;
    this.$container = param.$container;
    this.onNeedMore = param.onNeedMore || null;
    this.column_gap = param.column_gap || 20;
    this.column_width_base = param.column_width || 300;
    this.column_width;
    this.column_num;

    this.list = [];
    this.last_row = [];

    var scrollDelay,resizeDelay;
    this.scrollListener = function(){
      clearTimeout(scrollDelay);
      scrollDelay = setTimeout(function(){
        if(document.body.scrollTop + window.innerHeight >= document.body.scrollHeight - 300){
          me.onNeedMore && me.onNeedMore();
        }
      },100);
    };
    this.resizeListener = function(){
      clearTimeout(resizeDelay);
      resizeDelay = setTimeout(function(){
        me.buildLayout();
        me.$container.find('.stickItem').each(function(){
          me.fixPosition($(this));
        });
      },600);
    };
    $(document).scroll(this.scrollListener);
    $(window).resize(this.resizeListener);
    this.$container.html('');
    this.buildLayout();
  }
  Stick.prototype = {
    buildLayout : function(){
      var width = this.$container.width();
      this.list = [];
      this.last_row = [];
      this.column_num = parseInt((width+this.column_gap)/(this.column_width_base+this.column_gap));
      this.column_width = (width + this.column_gap)/this.column_num - this.column_gap;
    },
    fixPosition: function($item){
      if(this.column_num > 1){
        var column_index,
            top;
        if(this.list.length < this.column_num){
          column_index = this.list.length;
          this.last_row.push($item.height());
        }else{
          top = Math.min.apply(null,this.last_row);
          column_index = this.last_row.indexOf(top);
          top = top + this.column_gap;
        }
        this.list.push($item);
        $item.css({
          position : 'absolute',
          top: top || 0,
          left: column_index * (this.column_width + this.column_gap),
          width: this.column_width
        }).addClass('stickItem fadeInLeft');
        setTimeout(function(){
          $item.removeClass('fadeInLeft');
        },1000);
        this.last_row[column_index] = parseInt($item.css('top')) + $item.height();
        this.$container.height(Math.max.apply(null,this.last_row) + this.column_gap);
      }else{
         $item.css({
          position : 'static',
          width: 'auto'
        });
      }
    },
    addItem: function($item,cover){
      var me = this;
      loadImg(cover,function(){
        me.$container.append($item);
        me.fixPosition($item);
      });
    },
    destroy: function(){
      $(document).unbind('scroll',this.scrollListener);
      $(window).unbind('resize',this.resizeListener);
    }
  };
  return Stick;
});