/**
 * @author bh-lay
 */

var fs = require('fs');


function Filer(param){
  this.staticFileRoot = param.root;
  this.mime = param.mime;
  this.maxAge = param.maxAge;
}
Filer.prototype.read = function(path,req,responseFile,notFound) {
  var me = this;
  //匹配文件扩展名
  var pathname_split = path.match(/.\.([^.]+)$/);
  var ext = pathname_split ? pathname_split[1] : null;

  var realPath;
  //add a default files for directory
  if(ext == null) {
    ext = 'html';
    realPath = this.staticFileRoot + path + '/index.html'
  }else{
    realPath = this.staticFileRoot + path;
  }
  var content_type = this.mime[ext]||'unknown';

  fs.exists(realPath, function(exists) {
    if(!exists){
      notFound();
      return ;
    }
    fs.readFile(realPath, function(err, file) {
      if(err) {
        /**
         * 500 server error 
         */
        responseFile(500,{
            'Content-Type' : 'text/plain'
        },'ext:' + ext + ',realPath:' + realPath);

        return
      }
      fs.stat(realPath, function(err, stat) {
        if(err) {
          /**
           * 500 server error 
           */
          responseFile(500,{
              'Content-Type' : 'text/plain'
          },'ext:' + ext + ',realPath:' + realPath);

          return
        }
        var lastModified = stat.mtime.toUTCString();

        if(req.headers['if-modified-since'] && (lastModified == req.headers['if-modified-since'])) {
            responseFile(304);
        } else {
          var expires = new Date();
          expires.setTime(expires.getTime() + me.maxAge * 1000);
          responseFile(200,{
              "Content-Type" : content_type,
              "Expires" : expires.toUTCString() ,
              "Cache-Control" : "max-age=" + me.maxAge ,
              "Last-Modified" : lastModified,
          },file);
        }
      });
    });
  });
};
module.exports = Filer;