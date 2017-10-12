import './comment.less';

import utils from '../js/Base.js';
import juicer from '../js/juicer.js';
import Pagination from '../js/pagination.js';
import selection from './selection.js';
import face from './face.js';
import UI from '../js/dialog.js';
import userData from '../js/user.js'

let privateUserInfo = null;
let defaultAvatar = require('../images/default.jpg');

let noDataTpl = '<div class="l_com_list_noData">来的真早，快抢沙发！</div>';
let baseTpl = require('./base.html');
let sendBoxTpl = require('./sendBox.html');
let userTpl = require('./user.html');
let listTpl = require('./list.html');
let itemTpl = require('./item.html');

/**
 * 格式化网址
 *
 */
function parseUrl (input) {
  let output = null;
  // 是否符合网址规范
  if (typeof input === 'string' && input.match(/[\w-]+\.\w{2,4}/)) {
    // 补全协议
    output = input.match(/^http(?:s|):\/\//) ? input : ('http://' + input);
  }
  return output;
}

// 处理自定义事件
function ON (eventName, callback) {
  this._events = this._events || {};
  // 事件堆无该事件，创建一个事件堆
  if (!this._events[eventName]) {
    this._events[eventName] = [];
  }
  this._events[eventName].push(callback);
  // 提供链式调用的支持
  return this;
}

function EMIT (eventName, args) {
  this._events = this._events || {};
  // 事件堆无该事件，结束运行
  if (!this._events[eventName]) {
    return;
  }
  for (let i = 0, total = this._events[eventName].length; i < total; i++) {
    this._events[eventName][i].apply(this.event_global || this, args);
  }
}

/**
 * 设置用户信息
 *
 */
function setUserInfoToUI (userInput) {
  userInput = userInput || {};
  let user = {
    username: userInput.username || '',
    email: userInput.email || '',
    blog: userInput.blog || '',
    avatar: userInput.avatar || defaultAvatar
  };
  let screenName = user.username || '雁过留名';
  let nodeUser = utils.query('.l_send_username', this.dom);
  nodeUser.innerHTML = screenName;
  nodeUser.setAttribute('title', screenName);
  utils.query('.l_send_avatar img', this.dom).setAttribute('src', user.avatar);
}

/**
 * 转换emoji表情
 */
function strToEmoji (str) {
  return str.replace(/:((\w|-)+):/g, '<span class="emoji s_$1"></span>');
}

/**
 * 发送评论
 *
 */
function sendComment (data, onSubmit) {
  let user;
  if (data.user.id) {
    user = null;
  } else if (data.user && data.user.username.length > 0) {
    user = data.user;
  } else {
    onSubmit && onSubmit('未登录');
    return;
  }

  utils.fetch({
    url: '/ajax/comments/add',
    type: 'POST',
    data: {
      cid: data.id,
      content: data.text,
      // 如果为登录用户，则不发送用户信息
      user: user,
      reply_for_id: data.reply_for_id
    },
    callback: function (err, data) {
      if (!err && data.code && data.code === 200) {
        onSubmit && onSubmit(null, data.data);
      } else {
        onSubmit && onSubmit('fail');
      }
    }
  });
}

/**
 * 询问用户信息
 *
 */
function askForUserInfo (callback) {
  let me = this;
  // 用户信息
  let user = privateUserInfo;
  let pop = UI.pop({
    title: '雁过留名',
    width: 300,
    html: userTpl,
    easyClose: false,
    mask: true,
    confirm: confirmFn
  });
  let nodeUsername = utils.query('input[name="username"]', pop.dom);
  let nodeEmail = utils.query('input[name="email"]', pop.dom);
  let nodeBlog = utils.query('input[name="blog"]', pop.dom);

  function confirmFn () {
    let username = nodeUsername.value;
    let email = nodeEmail.value;
    let blog = nodeBlog.value;
    if (username.length < 1) {
      UI.prompt('大哥，告诉我你叫什么呗！', null, {
        from: 'top'
      });
      return false;
    }
    if (blog.length && !parseUrl(blog)) {
      UI.prompt('博客地址是对的么？', null, {
        from: 'top'
      });
      return false;
    }
    userData.setLocalUser({
      username: username,
      email: email,
      blog: blog
    });
    // 更新用户信息
    userData.info(function (err, user) {
      if (err) {
        privateUserInfo = null;
      } else if (user) {
        privateUserInfo = user;
      }
      EMIT.call(me, 'login', [privateUserInfo]);
      callback && callback();
    });
  }

  if (user) {
    nodeUsername.value = user.username || '';
    nodeEmail.value = user.email || '';
    nodeBlog.value = user.blog || '';
  }
}

/**
 * 绑定dom事件
 */
function bindDomEvent () {
  let me = this;
  let nodeGlobal = me.dom;
  let nodeTextarea = utils.query('textarea', nodeGlobal);
  let inputDelay;
  let focusDelay;

  utils.bind(nodeTextarea, 'keyup keydown change propertychange input paste', function () {
    clearTimeout(inputDelay);
    inputDelay = setTimeout(function () {
      let newVal = nodeTextarea.value.trim();
      // 校验字符是否发生改变
      if (newVal === me.text) {
        return;
      }
      me.text = newVal;
      // 触发自定义事件“change”
      EMIT.call(me, 'change');
    }, 80);
  }).bind('focus', function () {
    clearTimeout(focusDelay);
    utils.addClass(nodeGlobal, 'l_sendBox_active');
  }).bind('focusout blur', function () {
    clearTimeout(focusDelay);
    focusDelay = setTimeout(function () {
      if (me.text.length === 0) {
        utils.removeClass(nodeGlobal, 'l_sendBox_active');
      }
    }, 200);
  });

  utils.bind(nodeGlobal, 'click', '.l_send_placeholder', function () {
    nodeTextarea.focus();
  }).bind('click', '.set-userinfo', function () {
    askForUserInfo.call(me);
  }).bind('click', '.l_send_submit', function () {
    me.submit();
  }).bind('click', '.l_send_face', function () {
    let offset = utils.offset(this);
    nodeTextarea.focus();
    face({
      top: offset.top,
      left: offset.left,
      onSelect: function (title) {
        selection.insertTxt(nodeTextarea, ':' + title + ':');
        utils.trigger(nodeTextarea, 'change');
      }
    });
  });
}

// 绑定对象自定义事件
function bindCustomEvent () {
  let me = this;
  let nodeGlobal = this.dom;
  let nodeTextarea = utils.query('textarea', nodeGlobal);
  let nodeCount = utils.query('.l_send_count', nodeGlobal);
  let nodeCountRest = utils.query('b', nodeCount);

  // 监听字符变化事件
  this.on('change', function () {
    let length = nodeTextarea.value.length;
    let restLength = me.limit - length;
    let showText = restLength;
    if (length > 2 * me.limit / 3) {
      nodeCount.style.display = 'block';
      if (restLength < 0) {
        showText = `<font color="#f50">${restLength}</font>`;
      }
      nodeCountRest.innerHTML = showText;
    } else {
      nodeCount.style.display = 'none';
    }
  }).on('login', function (user) {
    // 设置用户信息
    setUserInfoToUI.call(me, user);
    privateUserInfo = user;
  }).on('sendToServiceError', function () {
    UI.prompt('网络出错，没发成功！');
  }).on('sendToServiceSuccess', function () {
    nodeTextarea.value = '';
    utils.trigger(nodeTextarea, 'change');
    UI.prompt('发布成功！');
  });
}

/**
 * SendBox类
 */
function SendBox (dom, id, param) {
  param = param || {};
  let me = this;
  this.id = id;
  this.reply_for_id = param.reply_for_id || null;
  this.isSubmitting = false;
  this.limit = 500;
  this.dom = utils.createDom(sendBoxTpl);
  this.text = '';
  this.userDefine = {};
  this.onBeforeSend = param.onBeforeSend || null;
  dom.innerHTML = '';
  dom.appendChild(this.dom);

  // 绑定dom事件
  bindDomEvent.call(this);
  // 绑定对象自定义事件
  bindCustomEvent.call(this);
  userData.info(function (err, user) {
    if (err) {
      privateUserInfo = null;
    } else if (user) {
      privateUserInfo = user;
    }
    setUserInfoToUI.call(me, user);
  });
  if (param.focus) {
    utils.query('textarea', this.dom).focus();
  }
}

SendBox.prototype = {
  on: ON,
  submit: function () {
    let me = this;
    let nodeTextarea = utils.query('textarea', this.dom);

    nodeTextarea.focus();
    if (this.isSubmitting) {
      return null;
    } else if (this.text.length === 0) {
      UI.prompt('你丫倒写点东西啊！', null);
    } else if (this.text.length > 500) {
      UI.prompt('这是要刷屏的节奏么！', null);
    } else if (privateUserInfo) {
      let text = this.onBeforeSend ? (this.onBeforeSend(me.text) || me.text) : me.text;
      me.isSubmitting = true;
      sendComment({
        id: me.id,
        text: text,
        user: privateUserInfo,
        reply_for_id: me.reply_for_id || null
      }, function (err, item) {
        me.isSubmitting = false;
        if (err) {
          EMIT.call(me, 'sendToServiceError');
        } else {
          EMIT.call(me, 'sendToServiceSuccess', [item]);
        }
      });
    } else {
      askForUserInfo.call(me, function () {
        me.submit();
      });
    }
  }
};

/**
 * 列表类
 *
 */
function List (dom, cid, param) {
  let me = this;
  param = param || {};
  // comment id
  this.cid = cid;
  this.list = [];
  this.skip = 0;
  this.limit = param.list_num || 15;
  this.total = 0;
  this._status = 'normal';

  this.dom = utils.createDom(listTpl);

  dom.innerHTML = '';
  dom.appendChild(this.dom);

  this.getData(0, function (err, data) {
    if (err) {
      utils.query('.l_com_list_cnt', me.dom).innerHTML = noDataTpl;
      return;
    }

    var hashMatch = (location.hash || '').match(/#comments-(.+)/);

    var html = juicer(itemTpl, data);
    utils.query('.l_com_list_cnt', me.dom).innerHTML = html;

    if (hashMatch) {
      var dom = utils.query('.l_com_item[data-id="' + hashMatch[1] + '"]', me.dom);
      setTimeout(function () {
        me.scrollTo(dom);
        utils.addClass(dom, 'l_com_item_ani-active');
      }, 500);
    }
    if (me.total === 0) {
      utils.query('.l_com_list_cnt', me.dom).innerHTML = noDataTpl;
    } else {
      // 分页组件
      let page = new Pagination(utils.query('.l_com_list_pagination', me.dom), {
        listCount: me.total,
        pageCur: 0,
        pageListNum: me.limit,
        maxPageBtn: 6
      });
      page.jump = function (num) {
        me.scrollTo(me.dom);
        me.getData((num - 1) * me.limit, function (err, data) {
          if (err) {
            console.log('error');
            return;
          }
          let html = juicer(itemTpl, data);
          utils.query('.l_com_list_cnt', me.dom).innerHTML = html;
        });
      };
    }
  });
  utils.bind(me.dom, 'click', '.btn-reply', function () {
    let item = utils.parents(this, '.l_com_item');
    let replyForUsername = item.getAttribute('data-username');
    let pop = UI.pop({
      title: '回复：' + replyForUsername,
      mask: true,
      easyClose: false,
      from: 'top',
    });
    let send = new SendBox(pop.cntDom, me.cid, {
      focus: true,
      reply_for_id: item.getAttribute('data-id'),
      onBeforeSend: function (text) {
        return '@' + replyForUsername + ' ' + text;
      }
    });
    utils.css(utils.query('.UI_pop_cpt', pop.dom), {
      border: 'none'
    });
    send.on('sendToServiceSuccess', function (item) {
      pop.close();
      me.addItem(item);
    });
  });
}

List.prototype.scrollTo = function (dom) {
  utils.query('body').scrollTop = utils.offset(dom).top - 70;
};
List.prototype.addItem = function (item) {
  item.time = '刚刚';
  item.content = strToEmoji(item.content);
  if (item.user && item.user.blog) {
    item.user.blog = parseUrl(item.user.blog);
  }
  let html = juicer(itemTpl, {
    list: [item]
  });
  let nodeItem = utils.createDom(html);
  let nodeListCnt = utils.query('.l_com_list_cnt', this.dom);
  nodeListCnt.insertBefore(nodeItem, nodeListCnt.firstChild);
  utils.addClass(nodeItem, 'l_com_item_ani-insert');
  let nodeNoData = utils.query('.l_com_list_noData', this.dom);
  nodeNoData && (nodeNoData.style.display = 'none');
};
List.prototype.getData = function (skip, onResponse) {
  if (this._status === 'loading') {
    return;
  }
  let me = this;
  this._status = 'loading';
  utils.fetch({
    url: '/ajax/comments/list',
    data: {
      cid: this.cid,
      skip: skip || 0,
      limit: this.limit || 10
    },
    callback: function (err, data) {
      me._status = 'loaded';
      if (err || data.code === 500) {
        onResponse && onResponse(500);
      } else if (data.code && data.code === 200) {
        let DATA = data.data;
        me.total = DATA.count;
        me.list = DATA.list;
        me.list.forEach(function (item) {
          item.time = utils.parseTime(item.time, '{h}:{ii} {y}-{m}-{d}');
          item.content = strToEmoji(item.content);
          // 若无头像，使用默认头像
          item.user.avatar = item.user.avatar || defaultAvatar;
          if (item.user.blog) {
            item.user.blog = parseUrl(item.user.blog);
          }
        });
        onResponse && onResponse(null, DATA);
      }
    }
  });
};

function Init (dom, id, param) {
  let me = this;
  this.dom = utils.createDom(baseTpl);
  this.id = id;
  dom.innerHTML = '';
  dom.appendChild(this.dom);

  this.sendBox = new SendBox(utils.query('.l_com_sendBox', this.dom), id, param);
  this.list = new List(utils.query('.l_com_list', this.dom), id, param);
  this.sendBox.on('sendToServiceSuccess', function (item) {
    me.list.addItem(item);
  });
}

export {SendBox, List, Init};
