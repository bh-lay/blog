/**
 * @author bh-lay
 *
 * get template that we have defined !
 *
 * exports.get(mod_name,{init:true});
 *    {init :true} replace public template
 *    {init :false} return original text
 *
 */

var fs = require('fs'),
    component = require('./component'),
    utils = require('./utils/index.js'),
    baseRoot = './views/';

/**
 * 获取components 配置
 *
 * @param String input ……<include name="navigation_bootstrap"  active="index"/>……
 * @returns {name:'navigation_bootstrap',active:'index'}
 */
function getComponentsConfig(input){
  var strArray = input.match(/\<include(.+?)\/>/g) || [],
      confArray = [];
  strArray.forEach(function(item,index){
    var data = {};
    //过滤多余的字符
    item = item.replace(/^<include\s+|"|'|\s*\/>$/g,'');
    //分离参数
    var dataArray = item.split(/\s+/) || [];

    dataArray.forEach(function(it){
      var itemSplit = it.split(/=/);
      var key = itemSplit[0];
      var value = itemSplit[1];
      data[key] = value;
    });
    confArray.push(data);
  });
  return confArray;
}
function replaceComponent(temp,callback){
  var need_temp = getComponentsConfig(temp),
      temp_result = {},
      over_count = 0;

  var total = need_temp.length;

  //没有用到components
  if(total == 0){
    callback(null,temp);
  }else{
    for(var i=0;i<total;i++){
      (function(i){
        var data = need_temp[i];
        var name = data.name;
        component.get(name,data,function(err,componentStr){
          temp_result[name] = componentStr;
          all_callBack();
        });
      })(i);
    }
  }
  function all_callBack(){
    over_count++;
    if(over_count == total){
      var html = temp.replace(/\<include\s+name\s*=\s*(?:"|')(.+?)(?:"|')([^\/])*\/>/g,function(includeStr,name){
        return temp_result[name] || includeStr;
      });
      callback(null,html);
    }
  }
}

module.exports = function(URI,data,callback){
  var realPath = baseRoot + URI,
      data = data || {};
  //增加文件配置
  data.frontEnd = this.config.frontEnd;

  //读取模版
  fs.readFile(realPath + '.html', "utf8",function(err,fileStr){
    if(err){
      callback && callback(err);
      return;
    }
    //替换变量
    fileStr = utils.juicer(fileStr,data);

    //解析模版的component
    replaceComponent(fileStr,function(err,txt){
      callback && callback(err,txt);
    });
  });
};
