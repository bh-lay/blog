/**
 * labs list
 *
 */

import './pano.less';
import utils from '../../js/Base.js';
import juicer from '../../js/juicer.js';

let emptyTpl = '<div class=\'blank-content\'><p>啥都木有</p></div>';
let baseTpl = require('./panoListBase.html');
let itemTemp = require('../../commons/templates/postListItem.html');

function getData (onSuccess, onError) {
  utils.fetch({
    type: 'GET',
    url: '/ajax/pano/list',
    data: {
      act: 'get_list'
    },
    callback: function (err, data) {
      if (!err && data && data.data && data.data.list) {
        onSuccess && onSuccess(filterData(data.data.list));
      } else {
        onError && onError();
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

export default function (global) {
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
