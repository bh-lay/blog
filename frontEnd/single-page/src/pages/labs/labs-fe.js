/**
 * labs list
 *
 */


import LabsBase from './labs-base.js';
import utils from '../../js/Base.js';
import imageHosting from '../../js/imageHosting.js';

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

      let list = data['list'];
      onSuccess && onSuccess(filterData(list));
    }
  });
}

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

export default function (global) {
  let node = global.node;
  let labsBase = new LabsBase(node, {
      activeSubNavIndex: 0,
      pageClass: 'labs-list-pager-fe',
      thirdProfile: {
        url: 'https://github.com/bh-lay',
        title: '小剧在Github',
        intro: '小剧也曾不知天高地厚的造过不少「轮子」，虽然不好用，但却是我成长路上一个个深深浅浅的脚印。'
      }
  });

  getData(function (list) {
    labsBase.renderList(list);
  }, function () {
    labsBase.renderEmpty();
  });
};
