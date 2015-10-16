
var fs = require('fs'),
    http = require('http'),
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
function staticFile(req,res){
  var path = req.url.split(/\?/)[0],
      pathname_split = path.match(/.\.([^.]+)$/),
      ext = pathname_split ? pathname_split[1] : null,
      realPath;
  realPath = staticFileRoot + path;
  
  //增加根目录 index.html 的支持
  if(ext == null) {
    ext = 'html';
    realPath += '/index.html'
  }
  
  var content_type = mime[ext]||'unknown';

  fs.exists(realPath, function(exists) {
    if(!exists){
      res.writeHead(404);
      res.end('404');
      return ;
    }
    fs.readFile(realPath, function(err, file) {
      if(err) {
        // 500 server error 
        res.writeHead(404);
        res.end('404');
        return
      }      
      //获取文件状态
      fs.stat(realPath, function(err, stat) {
        if(err) {
          // 500 server error 
          res.writeHead(404);
          res.end('404');
          return
        }
        
        var lastModified = stat.mtime.toUTCString();

        if(req.headers['if-modified-since'] && (lastModified == req.headers['if-modified-since'])) {
          // 500 server error 
          res.writeHead(304);
          res.end();
        } else {
          var expires = new Date();
          expires.setTime(expires.getTime() + maxAge * 1000);
          
          res.writeHead(200, {
            'Content-Type': content_type,
            'Expires' : expires.toUTCString() ,
            'Cache-Control' : "max-age=" + maxAge,
            'Last-Modified' : lastModified,
            'Access-Control-Allow-Origin' : "*"
          });
          res.end(file);
        }
      });
    });
  });
}

//创建服务
http.createServer(function (req, res) {
  var path = req.url.split(/\?/)[0];
  
  if( path == '/whoami' ){
    pageA(req,res,path)
  } else if(path.match(/user\/(.+:?)$/)){
    pageB(req,res,path)
  }else{
    staticFile(req,res);
  }
}).listen(server_port, '127.0.0.1');

console.log('server started ,you can press [ctrl + c] to exit !');