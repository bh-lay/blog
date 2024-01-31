/**
 * labs list
 *
 */
import LabsBase from './labs-base.js';

import utils from '../../js/Base.js';

function getData (onSuccess, onError) {
  utils.fetch({
    type: 'GET',
    url: '/api/pano/list',
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
    let thumb = 'https://ssl-thumb.720static.com/@' + item.property.thumbUrl + '?imageMogr2/thumbnail/560'
    item.title = item.property.name;
    item.desc = item.property.remark;
    item.url = 'http://720yun.com/t/' + item.property.pid + '?from=bh-lay';
    item.thumb = '/img-robber/' + btoa(thumb + '-https://720yun.com');
    item.pv = item.pvCount;
    item.like = item.likeCount;
  });
  return list;
}

export default function (global) {
  let node = global.node;
  let labsBase = new LabsBase(node, {
    activeSubNavIndex: 1,
    pageClass: 'labs-list-pager-pano',
    thirdProfile: {
      url: 'https://720yun.com/u/19023widcyv?from=bh-lay',
      title: '小剧在720云',
      intro: '以下作品无特殊说明均由小剧拍摄并制作完成，作品托管在720云。'
    }
  });

  getData(function (list) {
    labsBase.renderList(list);
  }, function () {
    labsBase.renderEmpty();
  });
};
