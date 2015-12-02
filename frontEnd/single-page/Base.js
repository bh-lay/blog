/**
 * IE9+
 **/

(function(){
  /**
   * 遍历
  **/
  function each(arr,fn,scope){
    //检测输入的值
    if(typeof(arr) == 'object' && typeof(fn) == 'function'){
      var Length = arr.length;
      if(Length && Length == +Length){
        for(var i=0;i<Length;i++){
          fn.call(scope,i,arr[i],this);
        }
      }else{
        for(var i in arr){
          if (!arr.hasOwnProperty(i)){
            continue;
          }
          fn.call(scope,i,arr[i],this);
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
    each([].slice.call(arguments),function(i,classname){
      addClass(this,classname);
    },this);
  });
})()

function fetch(param){
  param = param || {};
  var url = param.url,
      callback = param.callback || null,
      headers = param.headers || {};
  var request = new XMLHttpRequest();
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
  request.send();
}
