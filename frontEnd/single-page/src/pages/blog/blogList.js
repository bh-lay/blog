/**
 * blogList page
 *
 */

import './blogList.less';
import utils from '../../js/Base.js';
import imageHosting from '../../js/imageHosting.js';
import Stick from '../../js/stick.js';
import tie from '../../js/tie.js';
import juicer from '../../js/juicer.js';

let privateTagData = null;

function getTag (callback) {
  if (privateTagData) {
    callback && callback(privateTagData);
    return;
  }
  utils.fetch({
    url: '/ajax/tag/list',
    callback: function (err, data) {
      if (err) {
        // do something
      }
      data = data || {};
      data.list = data.list ? data.list.slice(0, 10) : [];
      privateTagData = data;
      callback && callback(privateTagData);
    }
  });
}

function renderTags (dom, tagName) {
  getTag(function (data) {
    let tagItemTpl = require('./blogListTag.html');
    let html = juicer(tagItemTpl, data);
    let selector = tagName ? `a[data-tag=${tagName}]` : 'a';

    dom.innerHTML = html;
    utils.addClass(utils.query(selector, dom), 'active');
  });
}

function LIST (tag, onLoadStart, onLoaded) {
  this.skip = 0;
  this.limit = 10;
  this.count = -1;
  this.tag = tag || null;
  this.onLoadStart = onLoadStart;
  this.onLoaded = onLoaded;
  this.isLoading = false;
  this.loadMore();
}

LIST.prototype.loadMore = function () {
  let me = this;
  if (this.isLoading || (this.count >= 0 && this.skip >= this.count)) {
    return;
  }
  this.isLoading = true;
  this.onLoadStart && this.onLoadStart();
  utils.fetch({
    url: '/ajax/blog',
    data: {
      act: 'get_list',
      skip: this.skip,
      tag: this.tag || null,
      limit: this.limit
    },
    callback: function (err, data) {
      if (err || !data || data.code === 200) {
        // do something
        return;
      }
      let count = data['count'];
      let list = data['list'];
      let now = new Date().getTime();
      for (var i in list) {
        // 三月内的文章都算最新（多可悲）
        if ((now - list[i].time_show) / (1000 * 60 * 60 * 24) < 90) {
          list[i].is_new = true;
        }
        list[i].time_show = utils.parseTime(list[i].time_show, '{mm}-{dd} {y}');
        // 使用七牛图床
        list[i].cover = imageHosting(list[i].cover, {
          type: 'zoom',
          width: 420,
        });
      }
      me.count = count;
      me.skip += me.limit;
      me.onLoaded && me.onLoaded(list, count);
      me.isLoading = false;
    }
  });
};

function page (global, param) {
  let me = this;
  let node = global.node;
  // 获取标签名
  let pageTag = param.tag ? decodeURI(param.tag) : null;
  let baseTpl = require('./blogListBase.html');
  let listTpl = require('./blogListItem.html');
  let emptyTpl = '<div class=\'blank-content\'><p>啥都木有</p></div>';
  // 插入基本模版
  node.innerHTML = baseTpl;
  this.nodeList = utils.query('.articleList', node);
  this.nodeLoading = utils.query('.l-loading-panel', node);

  this.stick = new Stick({
    container: me.nodeList,
    column_width: 280,
    column_gap: 10,
    load_spacing: 1000,
    onNeedMore: function () {
      list.loadMore();
    }
  });
  let nodeTag = utils.query('.articleListPage-tags', node);
  this.tie = tie({
    dom: nodeTag,
    scopeDom: utils.parents(nodeTag, '.articleListPage'),
    fixed_top: 55
  });
  // 创建列表对象
  let list = new LIST(pageTag, function () {
    utils.removeClass(me.nodeLoading, 'hide');
  }, function (list) {
    utils.addClass(me.nodeLoading, 'hide');
    if (!list || list.length === 0) {
      me.nodeList.innerHTML = emptyTpl;
    } else {
      list.forEach(function (item, index) {
        var html = juicer(listTpl, item);
        me.stick.addItem(html, item.cover);
      });
    }
  });
  // 处理标签功能
  renderTags(utils.query('.articleListPage-tags .content', node), pageTag);
}

page.prototype = {
  destroy: function () {
    this.stick.destroy();
    this.tie.destroy();
  }
};
export default page;
