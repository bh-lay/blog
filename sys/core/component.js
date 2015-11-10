/*
 * @author bh-lay
 *
 *  视图片段生成方式
 * 
 */


var fs = require('fs'),
    baseFileRoot = './component/',
    baseModuleRoot = '../component/';
//define template Object
exports.get = function(URI,data,callback){
  if(!callback){
    return
  }
  var realPath = baseFileRoot + URI;
  //读取
  fs.readFile(realPath + '.html', "utf8",function(err,txt){
    if(err){
      callback(err);
      return;
    }
    //得到模版内容
    var temp = txt;
    //查找脚本文件
    fs.exists(realPath + '.js', function(exists) {
      if(!exists){
        //没有脚本文件，直接返回模版内容
        callback(null,temp);
        return ;
      }
      //执行脚本文件
      require(baseModuleRoot + URI + '.js').produce(temp,data,function(err,html,data){
        callback(null,html,data);
      });
    });
  });
};