
var fs = require('fs'),
    http = require('http'),
    zlib = require("zlib"),
    staticFileRoot = '../static/',
    server_port = 8088,
    maxAge = 30 * 24 * 60 *60,
    //定义文件类型 Mime-Type
    mime = {
      html : 'text/html',
      js : 'application/javascript',
      css : 'text/css',
      jpg : 'image/jpeg',
      png : 'image/png',
      gif : 'image/gif'
    };

//拷贝参数
function cloneArg(arg){
  var obj = [];
  for(var i=0,total=arg.length;i<total;i++){
    obj[i] = arg[i];
  }
  return obj;
}
/**
 * 单线异步队列管理
 *
**/
function Step(callback){
  this._steps = [];
  this._currentStepIndex = -1;
  this.then(callback);
}
Step.prototype.then = function(callback){
  var me = this;
  if( typeof(callback) !== 'function'){
    throw Error('参数出错，第一个参数必须为function，第二个参数可选，且只能为对象格式');
  }
  this._steps.push([callback, {}]);
  return this;
};
Step.prototype.next = function(){
  var index = ++this._currentStepIndex;
  if(index >= this._steps.length){
    console.error('走到头了，多走了一步。');
    return;
  }
  var stepData = this._steps[index];
  var args = cloneArg(arguments);
  //第一位设置为step对象
  args.unshift(this);
  stepData[0].apply(stepData[1],args);
};
Step.prototype.start = function(){
  if(this._currentStepIndex >= 0){
    return;
  }
  this.next();
};

/**
 * 服务主方法
 *
 **/
function Server(req,res){
  var path = req.url.split(/\?/)[0],
      pathname_split = path.match(/.\.([^.]+)$/),
      ext = pathname_split ? pathname_split[1] : null,
      realPath = staticFileRoot + path,
      content_type;

  //增加根目录 index.html 的支持
  if(ext == null) {
    ext = 'html';
    realPath += '/index.html'
  }
  content_type = mime[ext]||'unknown';

  new Step(function(step){
    //第一步、检查文件是否存在
    fs.exists(realPath, function(exists) {
      if(!exists){
        res.writeHead(404);
        res.end('404');
      }else{
        step.next();
      }
    });
  })
  .then(function(step){
    //第二步、检查是否可用304缓存
    fs.stat(realPath, function(err, stat) {
      if(err) {
        // 500 server error
        res.writeHead(500);
        res.end('500');
        return
      }
      var lastModified = stat.mtime.toUTCString(),
          cacheModified = req.headers['if-modified-since'] || '';
      if(lastModified == cacheModified){
        // 使用缓存
        res.writeHead(304);
        res.end();
      } else {
        step.next(lastModified);
      }
    });
  })
  .then(function(step,lastModified){
    // 第三步、读取文件
    var expires = new Date(new Date().getTime() + maxAge * 1000),
        headers = {
          'Content-Type': content_type,
          'Expires' : expires.toUTCString(),
          'Cache-Control' : "max-age=" + maxAge,
          'Last-Modified' : lastModified,
          'Access-Control-Allow-Origin' : "*"
        },
        acceptEncoding = req.headers['accept-encoding'],
        stream = fs.createReadStream(realPath),
        gzipStream = zlib.createGzip();

    if(acceptEncoding && acceptEncoding.indexOf('gzip') != -1) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(200, headers);
      stream.pipe(gzipStream).pipe(res);
    }else{
      res.writeHead(200, headers);
      stream.pipe(res);
    }
  })
  .start();
}

//创建服务
http.createServer(Server).listen(server_port, '127.0.0.1');

console.log('server started ,you can press [ctrl + c] to exit !');
