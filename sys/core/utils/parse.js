/**
 * @author bh-lay
 */
var querystring = require('querystring'),
    formidable = require('formidable'),
    crypto = require('crypto');

//格式化cookie
exports.cookie = function parseCookie(str){
  var str = str ||'';
  var cookieData = {};
  
  var list = str.split(';');
  
  for(var i = 0 , t = list.length ; i < t ; i++){
    var parseList = list[i].split('=');
    var nameStr = parseList[0]||'';
    var name = nameStr.replace(/^\s+|\s+$/g,'');
    var value = parseList[1]||'';
    
    cookieData[name] = value;
  }
  return cookieData;
};

/**
 * @param (timestamp/Date,'{y}-{m}-{d} {h}:{i}:{s}')
 * 
 * y:year
 * m:months
 * d:date
 * h:hour
 * i:minutes
 * s:second
 * a:day
 */
exports.time = function(time,format){
  if(arguments.length==0){
    return null;
  }
  var format = format ||'{y}-{m}-{d} {h}:{i}:{s}';
  
  if(typeof(time) == "object"){
    var date = time;
  }else{
    var date = new Date(parseInt(time));
  }
  
  var formatObj = {
    y : date.getYear()+1900,
    m : date.getMonth()+1,
    d : date.getDate(),
    h : date.getHours(),
    i : date.getMinutes(),
    s : date.getSeconds(),
    a : date.getDay(),
  };
  
  var time_str = format.replace(/{(y|m|d|h|i|s|a)}/g,function(){
    return formatObj[arguments[1]] || 0;
  });
  return time_str;
};

/**
 * 格式化GET/POST的数据
 *  弥补querystring.parse的不足（不能解析多维数据）
 *  act=delete&user[id]&school[classA][studentA]=xiaoming
 *
 */
function parser_data(input){
  if(!input || input.length == 0){
    return {};
  }
  //querystring初步解析数据
  var data = querystring.parse(input);
  var obj = {};
  //遍历各个字段
  for(var key in data){
    var value = data[key];
    //检测键名是否包含子对象（user[id]）
    var test_key = key.match(/^(.+?)\[/);
    if(!test_key){
      //不包含子对象，直接赋值
      obj[key] = value;
    }else{
      //包含子对象，拼命解析开始
      
      //获取最顶层键名，构建对象
      var firstKey = test_key[1];
      obj[firstKey] = obj[firstKey] || {};
      
      var nextObj = obj[firstKey];
      var lastObj,lastKey;
      //使用正则模拟递归 遍历子对象（school[classA][studentA]）
      key.replace(/\[(.+?)\]/g,function(a,b){
        lastObj = nextObj;
        lastKey = b;
        lastObj[lastKey] = lastObj[lastKey] || {};
        nextObj = lastObj[lastKey];
      });
      //赋值
      lastObj[lastKey] = value;
    }
  }
  return obj;
}
/**
 * parse request data
 * callBack(err, fields, files);
 */
exports.request = function(req,callBack){
  if(!callBack){
    return;
  }

  var method = (req['method']||'').toLocaleLowerCase();
  var fields = parser_data(req.url.split('?')[1]);
    
  if(method == 'get'){
    callBack(null,fields,[]);
    }else{
      //直接取到的content-type，可能为“application/x-www-form-urlencoded; charset=UTF-8”
      var content_type = req['headers']['content-type'] || '';
      //FIXME 猥琐的处理方式
      content_type = content_type.split(';')[0];
      if(content_type == 'application/x-www-form-urlencoded'){
        var postData = "";
        // 数据块接收中
        req.addListener("data", function (postDataChunk) {
          postData += postDataChunk;
        });
        // 数据接收完毕，执行回调函数
        req.addListener("end", function () {
          var fields_post = parser_data(postData);
          //将URL上的参数非强制性的增加到post数据上
          for(var i in fields){
            if(!fields_post[i]){
              fields_post[i] = fields[i];
            }
          }
          callBack(null,fields_post);
        });
      }else{
        var form = new formidable.IncomingForm();
        form.uploadDir = "./temporary/upload";
        //form.keepExtensions = true;
        form.parse(req, function(error, fields_post, files) {
          // @FIXME when i upload more than one file ,the arguments files is only single file
          // but i can get all files information form form.openedFiles
          // it confused me

          files = form.openedFiles;
          //将URL上的参数非强制性的增加到post数据上
          for(var i in fields){
            if(!fields_post[i]){
              fields_post[i] = fields[i];
            }
          }
          callBack(error,fields_post, files);
        });
    }
  }
};



//parse URL
exports.url = function(url){
  var url = url||'';
  //filter url code '../'
    url = url.replace(/\.\.\//g,'');
  
  var a = url.split(/\?/);
  //去除首尾的“/”
  var b = a[0].replace(/^\/|\/$/g,'');
  var searchStr = a[1] || '';
  var search = querystring.parse(searchStr);
  
  var obj = {
    pathname : a[0],
    search : search,
    filename : null,
    pathnode : b.length?b.split(/\//):[],
  };
  
  obj['root'] = '/' + (obj['pathnode'][0]||'');
  
  if(obj['pathname'].match(/\/\w+\.\w+$/)){
    //obj.pathnode.pop();
    obj.filename = obj['pathname'].match(/\/(\w+\.\w+$)/)[1];
  }
  return obj;
};

exports.md5 = function(text) {
  text = text || '';
  if(typeof(text) != 'string'){
    text = text.toString();
  }
  return crypto.createHash('md5').update(text).digest('hex');
};
