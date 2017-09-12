/**
 * labs list
 *
 */

import './labs.less';
import utils from '../../js/Base.js';
import imageHosting from '../../js/imageHosting.js';
import juicer from '../../js/juicer.js';

let emptyTpl = '<div class=\'blank-content\'><p>啥都木有</p></div>';
let baseTpl = require('html-loader!./labsListBase.html');
let itemTemp = require('html-loader!../../postListItem.html');

let limit = 20;
let skip = 0;
let count = null;
var getData = function (callback) {
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
        callback && callback(500);
        return;
      }
      count = data['count'];
      skip += limit;

      let list = data['list'];
      callback && callback(null, filterData(list));
    }
  });
};

function filterData (list) {
  list.forEach(function (item) {
    //使用七牛图床
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
  getData(function (err, list) {
    let this_html;
    if (err) {
      this_html = emptyTpl;
    } else {
      this_html = juicer(itemTemp, {
        list: list
      });
    }
    utils.query('.labsList', node).innerHTML = this_html;
  });
};