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
      skip += limit;

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
      thirdProfile: {
        url: 'https://bh-lay.tuchong.com/?from=bh-lay',
        title: '小剧在图虫',
        intro: '摄影是小剧为数不多的爱好之一，这里仅仅是收藏一些还能看的过去的照片，作品托管在图虫。'
      }
  });

  getData(function (list) {
    labsBase.renderList(list);
  }, function () {
    labsBase.renderEmpty();
  });
};
