/**
 *使用七牛云存储
 * 若url为绝对地址，则使用源图，且不处理剪裁缩放
 * qiniu(url,config);
 */
define(function () {
  'use strict';
  function cover(url, config) {
    var w = config.width || config.height,
        h = config.height || config.width;
    return url + '?imageView/1/w/' + w + '/h/' + h + '/q/85';
  }
  function zoom(url, config) {
    var confStr;
    if (config.width) {
      confStr = 'w/' + config.width;
    } else {
      confStr = 'h/' + config.height;
    }

    return url + '?imageView2/2/' + confStr + '/q/85';
  }

  function qiniu(url, config) {
    var src = url;
    if (typeof (url) === 'string' && url.length > 0 && url[0] === '/') {
      src = app_config.imgDomain + url;
      if (config) {
        if (config.type === "zoom") {
          src = zoom(src, config);
        } else {
          //config.type == "cover"
          src = cover(src, config);
        }
      }
    }
    return src;
  }
  return qiniu;
});
