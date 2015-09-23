/**
 * @author bh-lay
 * @github https://github.com/bh-lay/lofox
 * @version 1.0
 * @modified 2015-06-29 00:05
 *  location fox
 */

(function(global,doc,factoryFn){
  var factory = factoryFn();
  global.util = global.util || {};
  global.util.lofox = factory;

  //提供CommonJS规范的接口
  global.define && define(function(require,exports,module){
    //对外接口
    return factory;
  });
})(window,document,function(){
  
  //主页面域名（包含协议）
  var LOCATION = window.location,
      //获取url中域名、协议正则 'http://xxx.xx/xxx','https://xxx.xx/xxx','//xxx.xx/xxx'
      private_reg_url = /^(http(?:|s)\:)*\/\/([^\/]+)/;
  
  //是否为非空的字符串
  function isNotEmptyString(input){
    return (typeof input == 'string' && input.length) ? true : false;
  }
  /**
   * URL与当前页面是否为同源
   *   同协议、同域名、同端口
   *   location.host 包含域名、端口
   **/
  function isSameOrigin(url){
    if(!isNotEmptyString(url)){
      return false;
    }
    var location_match = url.match(private_reg_url);
    if(!location_match){
      //没有域名信息，则为本域相对路径
      return true;
    }else if(location_match[2] == LOCATION.host && (!location_match[1] || location_match[1] == LOCATION.protocol)){
      //完整检测URL
      return true;
    }else{
      return false;
    }
  }
  /**
   * 格式化path 
   */
  function pathParser(input){
    //去除首尾的‘/’
    input = input.replace(/^\/*|\/*$/g,'');
    //分割路径
    var output = input.split(/\//);

    if(output.length == 1 && output[0] == ''){
      output = [];
    }
    return output;
  }
  /**
   * 格式化search 
   */
  function searchParser(search){
    var resultObj = {};
    if(search && search.length > 1){
      var items = search.split('&');
      for(var index = 0 ; index < items.length ; index++ ){
        if(! items[index]){
          continue;
        }
        var kv = items[index].split('=');
        resultObj[kv[0]] = typeof kv[1] === "undefined" ? "":kv[1];
      }
    }
    return resultObj;
  }
  /**
   * 事件触发器 
   */
  function EMIT(eventName,args){
    //事件堆无该事件，结束运行
    if(!this.events[eventName]){
      return
    }
    for(var i=0,total=this.events[eventName].length;i<total;i++){
      this.events[eventName][i].apply(this,args);
    }
  }
  function HTML5(){
    var this_fox = this;

    window.addEventListener('popstate',function(e){
      //console.log(e);
      var state = e.state || {};
      //console.log('from popstate event !',state);
      var url = state.url || null;
      console.log('arguments',e)
      //清除第一次不确定性的触发
      if(url){
        this_fox.refresh(url);
      }
      return false;
    });
    this.push = function(url){
      window.history.pushState({
        url: url
      },'test',url);
    }
  }

  function HASH(){
    var this_fox = this;

    //由于hash的特殊性，通过此值来判断是否需要触发refresh方法
    var private_need_refresh = true;
    //记录hash值
    var private_oldHash = LOCATION.hash;

    if(typeof(window.onhashchange) != 'undefined'){
      window.onhashchange = function(e){
        var new_hash = LOCATION.hash || '#';
        private_oldHash = new_hash;
        var url = new_hash.replace(/^#/,'');

        if(private_need_refresh){
          this_fox.refresh(url);
        }else{
          private_need_refresh = true;
        }
      }
    }else{
      setInterval(function(){
        var new_hash = LOCATION.hash || '#';
    //	console.log('interval',new_hash);
        //hash发生变化
        if(new_hash != private_oldHash){
          private_oldHash = new_hash;
          var url = new_hash.replace(/^#/,'');

          if(!private_need_refresh){
            this_fox.refresh(url);
          }else{
            private_need_refresh = true;
          }
        }
      },50);
    }


    //初始化处理hash
    if(private_oldHash.length < 2){
      private_oldHash = LOCATION.pathname;
      LOCATION.hash = private_oldHash;
    }
    this.push = function(url){
      private_need_refresh = false;
      this.url = url;
      LOCATION.hash = url;
    }
  }
  /**
   * 在maps匹配url并返回对应值
   * @param {Object} url
   * @param {Object} maps
   */
  function findPathInMaps(inputPath,maps){
    //定义从url中取到的值
    var matchValue = {};
    //记录找到的maps项
    var this_mapsItem = null;

    //遍历maps
    for(var i in maps){
      //获取maps当前项数组形式的url节点
      var pathData = pathParser(i);
      //比对输入url长度与maps当前节点长度是否一致
      if(pathData.length != inputPath.length){
        continue
      }

      this_mapsItem = maps[i];
      //遍历maps当前url节点
      for(var s=0,total=pathData.length;s<total;s++){
        //1.比对输入url与maps对应url是否一致
        if(pathData[s] != inputPath[s]){
          //2.检测当前节点是否为变量
          var tryMatch = pathData[s].match(/{(.+)}/);
          if(tryMatch){
            var key = tryMatch[1];
            matchValue[key] = inputPath[s];
          }else{
            //既不一致，又不是变量，丢弃此条maps记录
            this_mapsItem = null;
            matchValue = {};
            break
          }
        }
      }
      //若已经匹配出结果，结束匹配
      if(this_mapsItem){
        break
      }
    }
    return this_mapsItem ? {
        mapsItem : this_mapsItem,
        data : matchValue
      } : false;
  }
  /**
   *  lofox构造器
   * 
   */
  function LOFOX(param){
    //强制使用 new 方法
    if(!(this instanceof LOFOX)){
      return new LOFOX(param);
    }
    var this_fox = this,
        param = param || {};
    this.events = {};
    this.push = null;
    this._maps = {};
    //未加入maps列表的url
    this._rest = null;
    if(param.use != 'hash' && window.history&&window.history.pushState){
      this._use = 'html5';
      HTML5.call(this);
    }else{
      this._use = 'hash';
      HASH.call(this);
    }
    //为异步接口
    setTimeout(function(){
      this_fox.refresh();
    },10);
  }
  LOFOX.prototype = {
    rest : function(callback){
      if(typeof(callback) =='function'){
        this._rest = callback;
      }
      return this;
    },
    on : function ON(eventName,callback){
      //事件堆无该事件，创建一个事件堆
      if(!this.events[eventName]){
        this.events[eventName] = [];
      }
      this.events[eventName].push(callback);
      return this;
    },
    set : function(url,callback){
      var routerNames = [];
      var total;
      var type = Object.prototype.toString.call(url);
      if(type == '[object Array]'){
        routerNames = url;
        total = routerNames.length;
      }else if (type == '[object String]'){
        routerNames = [url];
        total = 1;
      }
      for (var i=0;i<total;i++) {
        var routerName = routerNames[i];
        var callback = typeof(callback) =='function' ? callback :null;
        this._maps[routerName] = {
          renderFn : callback
        };
      };
      return this;
    },
    //设置页面标题
    title : function(title){
      var type = typeof(title);
      if(type.match(/number|string/)){
        document.title = title
      }
    },
    //检测路径是否在路由中
    isInRouter: function(url){
      if(!isNotEmptyString(url)){
        return false;
      }
      //检测是否同域
      if(!isSameOrigin(url)){
        return false;
      }
      //
      var urlSplit = url.replace(private_reg_url,'').split(/\?/),
          pathData = pathParser(urlSplit[0].split('#')[0]),
          result = findPathInMaps(pathData,this._maps);
      return result ? true : false;
    },
    refresh : function (url){
      var urlString;
      if(url){
        urlString = url ;
      }else if(this._use == 'html5'){
        urlString = LOCATION.pathname+LOCATION.search+LOCATION.hash;
      }else if(this._use == 'hash'){
        urlString = LOCATION.hash || '#';
        //去除hash标记{#}
        urlString = urlString.replace(/^#/,'');
      }

      var urlSplit = urlString.length>0 ? urlString.split(/\?/) : ['',''],
          pathData = pathParser(urlSplit[0].split('#')[0]),
          searchData = searchParser(urlSplit[1]),
          result = findPathInMaps(pathData,this._maps);

      //触发视图刷新事件
      EMIT.call(this,'beforeRefresh',[pathData,searchData]);
      if(result){
        var data = result.data;
        //执行set方法设置的回调
        result.mapsItem['renderFn'].call(this,data,pathData,searchData);
        //设置标题
        result.mapsItem['title'] && this.title(result.mapsItem['title']);
      }else{
        this._rest && this._rest.call(this,pathData,searchData);
      }
      //触发视图刷新事件
      EMIT.call(this,'refresh',[pathData,searchData]);
    }
  };

  return LOFOX;
});