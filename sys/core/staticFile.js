/**
 * @author bh-lay
 */

var fs = require('fs'),
    zlib = require("zlib");


function Filer(param){
  this.staticFileRoot = param.root;
  this.mime = param.mime;
  this.maxAge = param.maxAge;
}
Filer.prototype.read = function(path,req,res,notFound) {
  //匹配文件扩展名
  var maxAge = this.maxAge;
  var pathname_split = path.match(/.\.([^.]+)$/);
  var ext = pathname_split ? pathname_split[1] : null;

  var realPath;
  //add a default files for directory
  if(ext == null) {
    ext = 'html';
    realPath = this.staticFileRoot + path + '/index.html';
  }else{
    realPath = this.staticFileRoot + path;
  }
  var content_type = this.mime[ext]||'unknown';

  fs.exists(realPath, function(exists) {
    if(!exists){
      notFound();
      return ;
    }

    fs.stat(realPath, function(err, stat) {
      if(err) {
        /**
         * 500 server error 
         */
        res.writeHead(500);
        res.end('500');
        return;
      }
      var lastModified = stat.mtime.toUTCString();

      if(req.headers['if-modified-since'] && (lastModified == req.headers['if-modified-since'])) {
          // 使用缓存
        res.writeHead(304);
        res.end();
      } else {
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
      }
    });
    
  });
};
module.exports = Filer;