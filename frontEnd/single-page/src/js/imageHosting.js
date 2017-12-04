/**
 *使用七牛云存储
 * 若url为绝对地址，则使用源图，且不处理剪裁缩放
 * qiniu(url,config);
 */

function cover (url, config) {
  let w = config.width || config.height;
  let h = config.height || config.width;
  return url + '?imageView/1/w/' + w + '/h/' + h + '/q/85';
}

function zoom (url, config) {
  if (!url) {
    return '';
  }
  let confStr;
  if (config.width) {
    confStr = 'w/' + config.width;
  } else if (config.height) {
    confStr = 'h/' + config.height;
  }

  return url + '?imageView2/2/' + confStr + '/q/85';
}

function qiniu (url, config) {
  let src = url;
  if (typeof (url) === 'string' && url.length > 0 && url[0] === '/') {
    /* global CDN_PATH */
    src = CDN_PATH + url;
    if (config) {
      if (config.type === 'zoom') {
        src = zoom(src, config);
      } else {
        // config.type == "cover"
        src = cover(src, config);
      }
    }
  }
  return src;
}

export default qiniu;
