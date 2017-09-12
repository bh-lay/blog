/**
 * labs list
 *
 */

import './pano.less';
import utils from '../../js/Base.js';
import juicer from '../../js/juicer.js';

var empty_tpl = '<div class=\'blank-content\'><p>啥都木有</p></div>',
  base_tpl = require('html-loader!./panoListBase.html'),
  item_temp = require('html-loader!../../postListItem.html');

var getData = function (callback) {
  utils.fetch({
    type: 'GET',
    url: '/ajax/pano/list',
    data: {
      act: 'get_list'
    },
    callback: function (err, data) {
      if (!err && data && data.data && data.data.list) {
        callback && callback(null, filterData(data.data.list));
      } else {
        callback && callback(500);
      }
    }
  });
};

function filterData (list) {
  list.forEach(function (item) {
    item.title = item.property.name;
    item.desc = item.property.remark;
    item.url = 'http://720yun.com/t/' + item.property.pid + '?from=bh-lay';
    item.thumb = 'http://thumb-qiniu.720static.com/@' + item.property.thumbUrl;
    item.pv = item.pvCount;
    item.like = item.likeCount;
  });
  return list;
}

export default function (global, param) {
  var node = global.node;

  node.innerHTML = base_tpl;

  getData(function (err, list) {
    var this_html;
    if (err) {
      this_html = empty_tpl;
    } else {
      this_html = juicer(item_temp, {
        list: list
      });
    }
    utils.query('.panoList', node).innerHTML = this_html;
  });
};
