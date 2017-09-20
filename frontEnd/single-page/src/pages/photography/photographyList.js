/**
 * labs list
 *
 */

import './photography.less';
import utils from '../../js/Base.js';
import juicer from '../../js/juicer.js';

let empty_tpl = '<div class="blank-content"><p>啥都木有</p></div>';
let base_tpl = require('./photographyListBase.html');
let item_temp = require('../../postListItem.html');

let getData = function (callback) {
  utils.fetch({
    type: 'GET',
    url: '/ajax/photography/list',
    data: {
      act: 'get_list'
    },
    callback: function (err, data) {
      if (err || data.code == 500) {
        callback && callback(500);
        return;
      }

      callback && callback(null, filterData(data.post_list));
    }
  });
};

function filterData (list) {
  list.forEach(function (item) {
    item.url += '?from=bh-lay';
    item.thumb = (item.images && item.images.length) ? item.images[0].source.g : (item.title_image ? item.title_image.url : '');
    item.desc = item.excerpt;
    item.like = item.favorites;
  });
  return list;
}

export default function (global, param) {
  let node = global.node;

  node.innerHTML = base_tpl;

  getData(function (err, list) {
    let this_html;
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