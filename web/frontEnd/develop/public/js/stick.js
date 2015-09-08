/**
 * @author bh-lay
 * 
 * @github: https://github.com/bh-lay/stick
 * 
 * @modified 2015-04-27 15:09
 *  
 */
(function(global,doc,factory){
  var Stick = factory(global,doc);
  //exports for commonJS
  global.Stick = global.Stick || Stick;
  global.define && define(function(require,exports){
    return Stick;
  });
})(window,document,function(window,document){
  /**
   * 检测是否为数字
   * 兼容字符类数字 '23'
   */
  function isNum(ipt){
      return (ipt !== '') && (ipt == +ipt) ? true : false;
  }
  /**
   * 遍历数组或对象
   * 
   */
  function each(arr,fn){
      //检测输入的值
      if(typeof(arr) != 'object' || typeof(fn) != 'function'){
          return;
      }
      var Length = arr.length;
      if( isNum(Length) ){
          for(var i=0;i<Length;i++){
              if(fn.call(this,i,arr[i]) === false) break;
          }
      }else{
          for(var i in arr){
              if (!arr.hasOwnProperty(i)) continue;
              if(fn.call(this,i,arr[i]) === false) break;
          }
      }
  }
  /**
   * 判断dom是否拥有某个class
   */
  function hasClass(elem,classSingle){
      return (elem.className && elem.className.match(new RegExp('(\\s|^)' + classSingle + '(\\s|$)'))) ? true : false;
  }
  function addClass(elem, cls) {
    if (!hasClass(elem, cls)) elem.className += " " + cls;
  }
  function removeClass(elem, cls) {
    if (hasClass(elem, cls)) {
      var reg = new RegExp('(\\s+|^)' + cls + '(\\s+|$)');
      elem.className.replace(reg, ' ');
    }
  }
  //创建dom
  function createDom(html){
      var a = document.createElement('div');
      a.innerHTML = html;
      return a.childNodes[0];
  }
  /**
   * 事件绑定
   * elem:节点
   * type:事件类型
   * handler:回调
   */
  var bind = window.addEventListener ? function(elem, type, handler) {
    // 标准浏览器
    elem.addEventListener(type, handler, false);
  } : function(elem, type, handler) {
    // IE浏览器
    elem.attachEvent("on" + type, handler);
  };
  /**
   * 事件解除
   * elem:节点
   * type:事件类型
   * handler:回调
   */
  var unbind = window.removeEventListener ? function(elem, type, handler) {
    // 标准浏览器
    elem.removeEventListener(type, handler, false);
  } : function(elem, type, handler) {
    // IE浏览器
    elem.detachEvent("on" + type, handler);
  };
  /**
   * 设置css
   * 精简后的方法，没处理数字型非像素的属性，如line-height、z-index
   *
   **/
  function setCss(elem,cssObj){
    each(cssObj,function(prop,value){
      if (isNum(value)) value += "px";
      elem.style[prop] = value;
    });
  }
  //图片预加载
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
    img.onerror = img.onload = End;
    var timer = setInterval(function(){
      img.width>1 && End();
    },2);
    img.src=src;
  }
  
  /**
   * 获取浏览器滚动尺寸
   *  为了兼容firefox
   */
  function getScrollTop(){
    return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
  }
  function fixItemPosition(item){
      if(this.column_num > 1){
        var column_index,
            top = 0;
        if(this.list.length < this.column_num){
          //第一排item
          column_index = this.list.length;
          this.last_row.push(item.clientHeight);
        }else{
          //其余
          top = Math.min.apply(null,this.last_row);
          column_index = this.last_row.indexOf(top);
          top = top + this.column_gap;
        }
        setCss(item,{
          position : 'absolute',
          top: top,
          left: Math.round(column_index * (this.column_width + this.column_gap)),
          width: Math.round(this.column_width)
        });
        addClass(item,'fadeInLeft');
        setTimeout(function(){
          removeClass(item,'fadeInLeft');
        },1000);
        this.last_row[column_index] = top + item.clientHeight;
        setCss(this.container,{
          height: Math.max.apply(null,this.last_row) + this.column_gap
        });
      }else{
        setCss(item,{
          position : 'static',
          width: 'auto'
        });
      }
      this.list.push(item);
    }
  
  /**
   * Stick
   */
  function Stick(param){
    var param = param || {},
        me = this;
    this.container = param.container;
    this.onNeedMore = param.onNeedMore || null;
    this.column_gap = param.column_gap ? parseInt(param.column_gap) : 20;
    this.column_width_base = param.column_width ? parseInt(param.column_width) : 300;
    this.column_width;
    this.column_num;
    this.load_spacing = param.load_spacing || 300;

    this.list = [];
    this.last_row = [];

    var scrollDelay,
        resizeDelay,
        last_time = 0;
    this.scrollListener = function(){
      var now = new Date().getTime();
      if(now - last_time > 500 && (getScrollTop() + window.innerHeight >= document.body.scrollHeight - me.load_spacing)){
        me.onNeedMore && me.onNeedMore();
        last_time = now;
      }
    };
    this.resizeListener = function(){
      clearTimeout(resizeDelay);
      resizeDelay = setTimeout(function(){
        me.refresh();
      },500);
    };
    bind(document,'scroll',this.scrollListener);
    bind(window,'resize',this.resizeListener);
    this.container.innerHTML = '';
    this.buildLayout();
  }
  Stick.prototype = {
    buildLayout : function(){
      var width = this.container.clientWidth;
      this.list = [];
      this.last_row = [];
      this.column_num = Math.floor((width+this.column_gap)/(this.column_width_base+this.column_gap));
      this.column_width = (width + this.column_gap)/this.column_num - this.column_gap;
    },
    refresh: function(item){
      var me = this;
      var oldList = me.list;
      me.buildLayout();
      
      if(me.column_num == 1){
        setCss(this.container,{
          height: 'auto'
        });
      }
      each(oldList,function(i,item){
        fixItemPosition.call(me,item);
      });
    },
    addItem: function(item,cover){
      var me = this;
      if(typeof(item) == 'string'){
        item = createDom(item);
      }
      loadImg(cover,function(){
        me.container.appendChild(item);
        fixItemPosition.call(me,item);
      });
    },
    addList: function(list){
      //尚未实现
    },
    destroy: function(){
      unbind(document,'scroll',this.scrollListener);
      unbind(window,'resize',this.resizeListener);
    }
  };
  return Stick;
});