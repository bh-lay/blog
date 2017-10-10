/**
 * labs list
 *
 */

import './labs.less';
import utils from '../../js/Base.js';
import imageHosting from '../../js/imageHosting.js';
import juicer from '../../js/juicer.js';

let emptyTpl = '<div class=\'blank-content\'><p>啥都木有</p></div>';
let baseTpl = require('./labsListBase.html');
let itemTemp = require('../../commons/templates/postListItem.html');

let limit = 20;
let skip = 0;

function getData (onSuccess, onError) {
  utils.fetch({
    type: 'GET',
    url: '/ajax/labs',
    data: {
      act: 'get_list',
      skip: skip,
      limit: limit
    },
    callback: function (err, data) {
      if (err || data.code === 500) {
        onError && onError();
        return;
      }
      skip += limit;

      let list = data['list'];
      onSuccess && onSuccess(filterData(list));
    }
  });
};

function filterData (list) {
  list.forEach(function (item) {
    // 使用七牛图床
    item.thumb = imageHosting(item.cover, {
      type: 'cover',
      width: 400,
      height: 400
    });
    item.desc = item.intro;
    item.url = '/labs/' + item.name;
    item.star = item.github.stargazers_count;
    item.fork = item.github.forks_count;
  });
  return list;
}

export default function (global, param) {
  let node = global.node;
  skip = 0;
  node.innerHTML = baseTpl;
  getData(function (list) {
    let thisHtml = juicer(itemTemp, {
      list: list
    });
    utils.query('.labsList', node).innerHTML = thisHtml;
  }, function () {
    utils.query('.labsList', node).innerHTML = emptyTpl;
  });
};
