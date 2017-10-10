/**
 * labs list
 *
 */

import './photography.less';
import utils from '../../js/Base.js';
import juicer from '../../js/juicer.js';

let emptyTpl = '<div class="blank-content"><p>啥都木有</p></div>';
let baseTpl = require('./photographyListBase.html');
let itemTemp = require('../../commons/templates/postListItem.html');

let getData = function (onSuccess, onError) {
  utils.fetch({
    type: 'GET',
    url: '/ajax/photography/list',
    data: {
      act: 'get_list'
    },
    callback: function (err, data) {
      if (err || data.code === 500) {
        onError && onError();
        return;
      }

      onSuccess && onSuccess(filterData(data.post_list));
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

  node.innerHTML = baseTpl;

  getData(function (list) {
    let thisHtml = juicer(itemTemp, {
      list: list
    });
    utils.query('.panoList', node).innerHTML = thisHtml;
  }, function () {
    utils.query('.panoList', node).innerHTML = emptyTpl;
  });
};
