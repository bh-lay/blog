/**
 * @author bh-lay
 * @version 1.0
 * @modified 2014-6-27 23:14
 */

var http = require('http'),
    connect = require('./connect.js'),
    views = require('./views.js'),
    cache = require('./cache.js'),
    staticFile = require('./staticFile.js'),
    url_redirect = require('../conf/301url'),
    config = require('../conf/app_config.js'),
    utils = require('./utils/index.js'),
    session_factory = require('./session.js');
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
 * 在 MAPS 匹配url并返回对应值
 * @param {Object} url
 */
function findUrlInMaps(inputPath,MAPS){
  //定义从url中取到的数据｛变量｝
  var matchValue = {},
      //记录找到的maps项
      this_mapsItem = null;

  //遍历maps
  for(var i in MAPS){
    //获取maps当前项数组形式的url节点
    var pathData = pathParser(i);
    //路径与maps当前节点长度不一致，或最后配置不为通配符“*”跳过
    if(pathData.length != inputPath.length && pathData[pathData.length -1] != '*'){
        continue;
    }

    this_mapsItem = MAPS[i];
    //遍历maps当前url节点
    for(var s=0,total=pathData.length;s<total;s++){
      //1.比对输入url与maps对应url是否一致
      if(pathData[s] != inputPath[s]){
        //2.检测当前节点是否为变量
        var tryMatch = pathData[s].match(/{(.+)}/);
        if(tryMatch){
          var key = tryMatch[1];
          matchValue[key] = inputPath[s];
        }else if(pathData[s] != '*'){
          //既不一致，又不是变量，也不是通配符，丢弃此条maps记录
          this_mapsItem = null;
          matchValue = {};
          break
        }
        //else{} //符合条件
      }
      //else{} //符合条件
    }
    //若已经匹配出结果，不再继续匹配
    if(this_mapsItem){
      break;
    }
  }
  if(this_mapsItem){
    return {
      mapsItem : this_mapsItem,
      data : matchValue
    };
  }else{
    return false;
  }
}

/**
 * 检测是否为正常用户
 */
function isNormalVisitor(req){
  var url = req.url;
  //检测路径中是否包含 ../
  if(url.match(/\.\.\//)){
    return true;
  }
  return false;
}
/**
 * application 类
 */
function APP(){
  var me = this;
  
  this.MAPS = {};
  this.fileReader = new staticFile(config.static);
  // server start
  var server = http.createServer(function (req,res) {
    if(isNormalVisitor(req)){
      res.writeHead(500);
      res.end('hello I\'m bh-lay !');
      return;
    }
    //实例化一个connect对象
    var new_connect = new connect(req,res,me.session),
        path = new_connect.url,
        pathNode = pathParser(path.pathname),
        result = findUrlInMaps(pathNode,me.MAPS);

    if(result){
      //第一顺序：执行get方法设置的回调
      var data = result.data;
      result.mapsItem.call(this,data,new_connect);
    }else{
      //第二顺序：使用静态文件
      me.fileReader.read(path.pathname,req,res,function(){
        //第三顺序：查找301重定向
        if(url_redirect[path.pathname]){
          new_connect.write('define',301,{
              'location' : url_redirect[path.pathname]
          });
        }else{
          //最终：只能404了
          me.views('system/404',{
              content : '文件找不到啦！'
          },function(err,html){
              new_connect.write('notFound',html);
          });
        }
      });
    }
  });

  server.listen(config.port);
  console.log('server start with port ' + config.port);
};

/**
 * 设置前端请求路径
 */
APP.prototype.get = function(urls,callback){
  var me = this,
      routerNames = [].concat(urls);
  
  if(typeof(callback) != 'function'){
    return;
  }
  routerNames.forEach(function(url,a,b){
    if(typeof(url) != 'string'){
      return;
    }
    me.MAPS[url] = callback;
  });
};

APP.prototype.views = views;
APP.prototype.cache = new cache({
  useCache: config.cache.use ? true : false,
  max_num: config.cache.max_num,
  root: config.cache.root
});
APP.prototype.session = new session_factory({
  root : config.session.root
});
APP.prototype.utils = utils;
APP.prototype.config = config;

module.exports = APP;