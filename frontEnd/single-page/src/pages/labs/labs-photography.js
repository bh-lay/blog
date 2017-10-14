/**
 * labs list
 *
 */

import LabsBase from './labs-base.js';
import utils from '../../js/Base.js';

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

export default function (global) {
  let node = global.node;
  let labsBase = new LabsBase(node, {
    activeSubNavIndex: 2,
    pageClass: 'labs-list-pager-photography',
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

