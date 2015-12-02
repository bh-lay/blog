/**
 * IE9+
 **/
window.utils = {};
(function(){
  /**
   * 检测是否为数字
   * 兼容字符类数字 '23'
   */
  function isNum(ipt){
    return (ipt !== '') && (ipt == +ipt) ? true : false;
  }

  /**
   * 遍历
  **/
  function each(arr,fn,scope){
    //检测输入的值
    if(typeof(arr) == 'object' && typeof(fn) == 'function'){
      var Length = arr.length;
      if(Length && Length == +Length){
        for(var i=0;i<Length;i++){
          fn.call(scope,arr[i],i,this);
        }
      }else{
        for(var i in arr){
          if (!arr.hasOwnProperty(i)){
            continue;
          }
          fn.call(scope,arr[i],i,this);
        }
      }
    }
  }
  function addPrototype(object,prop,fn){
    if(typeof(object.prototype[prop]) == 'undefined'){
      object.prototype[prop] = fn;
    }
  }
  /**
   * 判断dom是否拥有某个class
   */
  function hasClass(dom,classSingle){
    return dom.className && dom.className.match(new RegExp('(\\s|^)' + classSingle + '(\\s|$)')) || false;
  }
  function addClass(dom, cls) {
    if (!hasClass(dom, cls)) dom.className += " " + cls;
  }
  function removeClass(dom, cls) {
    if (hasClass(dom, cls)) {
      var reg = new RegExp('(\\s+|^)' + cls + '(\\s+|$)');
      dom.className = dom.className.replace(reg, ' ');
    }
  }
  addPrototype(Element,'addClass',function(){
    each([].slice.call(arguments),function(classname){
      addClass(this,classname);
    },this);
  });
  addPrototype(Element,'removeClass',function(){
    each([].slice.call(arguments),function(classname){
      removeClass(this,classname);
    },this);
  });

  /**
   * dom设置样式
   */
  function setStyle(elem,prop,value){
    prop = prop.toString();
    if (prop == "opacity") {
      elem.style.filter = 'alpha(opacity=' + (value * 100)+ ')';
      value = value;
    } else if ( isNum(value) && prop != 'zIndex'){
      value = value + "px";
    }
    elem.style[prop] = value;
  }
  //设置css
  addPrototype(Element,'css',function(cssObj){
    var node = this;
    /**
     * 为css3属性增加扩展
     */
    each(cssObj,function(value,key){
      if(key == 'transform' || key == 'transition'){
        each(['webkit','o','moz'],function(i,text){
          cssObj['-' + text + '-' + key] = value
        });
      }
    });
    each(cssObj,function(value,key){
    console.log(key,value);
      setStyle(node,key,value);
    });
  });

  /**
   * 事件绑定
   * elem:节点
   * type:事件类型
   * handler:回调
   */
  var bindHandler = (function() {
    // 标准浏览器
    if (window.addEventListener) {
      return function(elem, type, handler) {
        // 最后一个参数为true:在捕获阶段调用事件处理程序
        //为false:在冒泡阶段调用事件处理程序
        elem.addEventListener(type, handler, false);
      }
    } else if (window.attachEvent) {
      // IE浏览器
      return function(elem, type, handler) {
        elem.attachEvent("on" + type, handler);
      }
    }
  })();

  /**
   * 事件解除
   * elem:节点
   * type:事件类型
   * handler:回调
   */
  var removeHandler = (function() {
    // 标准浏览器
    if (window.removeEventListener) {
      return function(elem, type, handler) {
        elem.removeEventListener(type, handler, false);
      }
    } else if (window.detachEvent) {
      // IE浏览器
      return function(elem, type, handler) {
        elem.detachEvent("on" + type, handler);
      }
    }
  })();

  function checkEventForClass(event,classStr,dom){
    var target = event.srcElement || event.target;
    while (1) {
      if(target == dom || !target){
        return false;
      }
      if(hasClass(target,classStr)){
        return target;
      }

      target = target.parentNode;
    }
  }

  function checkEventForTagName(event,tagname,dom){
    var target = event.srcElement || event.target;
    tagname = tagname.toLowerCase();
    while (1) {
      if(target == dom || !target){
        return false;
      }
      if(tagname == target.tagName.toLowerCase()){
        return target;
      }

      target = target.parentNode;
    }
  }
  function bind(elem, type,a,b){
    var checkStr,checkEventFn,fn,
        elems = [].concat(elem);
    each(elems,function(node){
      if(typeof(a) == 'string'){
        if(a.slice(0,1) == '.'){
          checkStr = a.replace(/^\./,'');
          checkEventFn = checkEventForClass;
        }else{
          checkStr = a;
          checkEventFn = checkEventForTagName;
        }
        fn = b;
        callback = function(e){
          var bingoDom = checkEventFn(e,checkStr,node);
          if(bingoDom){
            fn && fn.call(bingoDom,e);
          }
        };
      }else{
        callback = a;
      }
      bindHandler(node,type,callback);
    });
  }
  addPrototype(Element,'on',function(a,b,c){
    bind(this,a,b,c)
  });
  function createDom(html){
    var a = document.createElement('div');
    a.innerHTML = html;
    return a.childNodes[0];
  }

  utils.each = each;
  utils.createDom = createDom;
})();





utils.fetch = function (param){
  param = param || {};
  var url = param.url,
      callback = param.callback || null,
      headers = param.headers || {},
      data = param.data,
      dataStr = '',
      request = new XMLHttpRequest();
  for(var i in data){
    dataStr += i + '=' +(data[i]||'') + '&';
  }
  url = dataStr.length ? (url + '?' + dataStr) : url;
  request.open('GET', url, true);
  headers.accept = "application/json, text/javascript";
  //设置 headers
  for(i in headers){
    request.setRequestHeader(i, headers[i]);
  }
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var resp = request.responseText;
      resp = JSON.parse(resp);
      callback && callback(null,resp,request);
    } else {
      callback && callback(request.status,resp,request);
    }
  };

  request.onerror = function() {
    callback && callback('connection fail',resp,request);
  };
  request.send(dataStr);
}
