/**
 * IE9+
 **/
/**
 * 检测是否为数字
 * 兼容字符类数字 '23'
 */
function isNum (ipt) {
  return typeof ipt === 'number' || parseInt(ipt, 10) === +ipt;
}

/**
 * 遍历
 **/
function each (arr, fn, scope) {
  // 检测输入的值
  if (typeof arr !== 'object' || typeof fn !== 'function') {
    return;
  }
  let Length = arr.length;
  if (isNum(Length)) {
    for (let i = 0; i < Length; i++) {
      fn.call(scope, arr[i], i, this);
    }
  } else {
    for (let i in arr) {
      if (!arr.hasOwnProperty(i)) {
        continue;
      }
      fn.call(scope, arr[i], i, this);
    }
  }
}

// 判断 dom 是否符合
let matches = (function () {
  let prop = Element.prototype;
  let matches = prop.matches || prop.matchesSelector || prop.msMatchesSelector || prop.mozMatchesSelector || prop.webkitMatchesSelector || prop.oMatchesSelector;
  return function (target, selector) {
    return matches.call(target, selector);
  };
})();

/**
 * 判断dom是否拥有某个class
 */
function hasClass (dom, classSingle) {
  if (dom && dom.className) {
    return !!dom.className.match(new RegExp('(\\s|^)' + classSingle + '(\\s|$)'));
  }
}

function addClass (dom, cls) {
  if (dom && !hasClass(dom, cls)) {
    dom.className += ' ' + cls;
  }
}

function removeClass (dom, cls) {
  if (dom && hasClass(dom, cls)) {
    let reg = new RegExp('(\\s+|^)' + cls + '(\\s+|$)');
    dom.className = dom.className.replace(reg, ' ');
  }
}

function toggleClass (dom, cls) {
  (hasClass(dom, cls) ? removeClass : addClass)(dom, cls);
}

/**
 * dom设置样式
 */
function setStyle (elem, prop, value) {
  prop = prop.toString();
  if (isNum(value) && prop !== 'zIndex') {
    value = value + 'px';
  }
  elem.style[prop] = value;
}

function CSS (node, cssObj) {
  if (!node || !cssObj) {
    return;
  }
  /**
   * 为css3属性增加扩展
   */
  each(cssObj, function (value, key) {
    if (key === 'transform' || key === 'transition') {
      each(['webkit', 'o', 'moz'], function (i, text) {
        cssObj['-' + text + '-' + key] = value
      });
    }
  });
  each(cssObj, function (value, key) {
    setStyle(node, key, value);
  });
}

// 读取dom在页面中的位置
function offset (elem) {
  let box = {
    top: 0,
    left: 0,
    screen_top: 0,
    screen_left: 0
  };
  let size;

  if (typeof elem.getBoundingClientRect !== 'undefined') {
    size = elem.getBoundingClientRect();
  }
  box.screen_top = size.top;
  box.screen_left = size.left;

  box.top = size.top + (document.documentElement.scrollTop === 0 ? document.body.scrollTop : document.documentElement.scrollTop);
  box.left = size.left + document.body.scrollLeft;

  return box;
}

let privatePrefix = 'Query';
let privateSalt = parseInt(new Date().getTime() / 1000).toString(36);
let operateId = 0;

// 查找 DOM，仅限内部调用参数不做校验
function findNode (selector, context, queryMethod) {
  let id = context.getAttribute('id');
  let useID;
  let returns;
  if (!id) {
    // 生成临时 ID
    useID = [privatePrefix, privateSalt, ++operateId].join('_');
    context.setAttribute('id', useID);
  } else {
    useID = id;
  }
  returns = document[queryMethod]('#' + useID + ' ' + selector);

  !id && nextTick(function () {
    context.removeAttribute('id');
  });
  return returns;
}

/**
 * nextTick
 * https://github.com/DDFE/next-tick/
 */
// 等待调用的函数栈
let nextTickCallbacks = [];
// 当前是否正在运行中
let nextTickIsRunning = false;

// 调用所有在函数栈中的函数
// 如果在执行某函数时又有新的函数被添加进来，
// 该函数也会在本次调用的最后被执行
function callAllCallbacks () {
  let cbs = nextTickCallbacks;
  let count = cbs.length;
  nextTickCallbacks = [];
  nextTickIsRunning = false;

  for (let index = 0; index < count; index++) {
    cbs[index]();
  }
}

function nextTick (fn) {
  // 将函数存放到待调用栈中
  nextTickCallbacks.push(fn);

  // 判断定时器是否启动
  // 如果没有启动，则启动计时器
  // 如果已经启动，则不需要做什么
  // 本次添加的函数会在 callAllCallbacks 时被调用
  if (!nextTickIsRunning) {
    nextTickIsRunning = true;
    setTimeout(callAllCallbacks, 0);
  }

  return nextTickCallbacks.length;
}

/**
 * 检索DOM
 *  selector：选择器
 *  context：查找对象，可选
 *  isAllMatches：是否匹配所有元素，默认：是
 **/
function Query (selector, context, isAllMatches) {
  // 全部匹配还是进返回单个 node
  isAllMatches = (typeof isAllMatches === 'boolean') ? isAllMatches : true;
  let returns = [];
  let selectorMatchs;
  let queryMethod = 'querySelector' + (isAllMatches ? 'All' : '');
  // 查询语句不存在或不为字符串，返回空数组
  if (!selector || typeof selector !== 'string') {
    return returns;
  }
  // 查找对象存在，使用 find 逻辑
  if (context && context.nodeType) {
    // 匹配选择器
    selectorMatchs = selector.match(/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/);
    // 选择器为简单模式
    if (selectorMatchs) {
      // ID
      if (selectorMatchs[1]) {
        returns = [context.getElementById(selectorMatchs[1])];
      } else if (selectorMatchs[2]) {
        // classname
        returns = context.getElementsByTagName(selectorMatchs[2]);
      } else {
        // tagname
        returns = context.getElementsByClassName(selectorMatchs[3]);
      }
      // 返回单个 node
      !isAllMatches && (returns = returns[0] || null);
    } else {
      returns = findNode(selector, context, queryMethod)
    }
  } else {
    // 直接 query
    returns = document[queryMethod](selector);
  }
  return returns;
}

/**
 * 匹配 selector 与 dom 间关系
 **/
function matchsSelectorBetweenNode (fromNode, selector, endNode) {
  let target = fromNode;
  let selectors = selector.trim().split(/\s+/);
  let lastSelect = selectors.pop();
  let parentsList = [];
  let bingoDom;

  while (1) {
    // 匹配结束
    if (target === endNode || !target) {
      return false;
    }
    // 单条匹配成功
    if (matches(target, lastSelect)) {
      // 命中的 dom
      if (!bingoDom) {
        bingoDom = target;
      }
      // 拆分当前匹配
      parentsList = lastSelect.split(/\s*>\s*/);
      // 包含父级匹配，如 .parent>.child>span
      if (parentsList.length > 1) {
        // 最后一条已无需对比
        parentsList.pop();
        // 逆序遍历父级列表
        for (let i = parentsList.length - 1; i >= 0; i--) {
          target = target.parentNode;
          if (!matches(target, parentsList[i])) {
            return false;
          }
        }
      }
      if (!selectors.length) {
        return bingoDom;
      }
      lastSelect = selectors.pop();
    }
    target = target.parentNode;
  }
}

/**
 * 事件绑定
 * elem: dom 节点，支持数组和单个 node节点
 * type: 事件类型，支持空格分割多个事件如：'keydown keyup'
 * selector: 可选，用于事件委托
 * callback: 回调函数，最后一个参数
 */
function bind (elem, type, a, b) {
  let elems = [].concat(elem);
  let types = type.split(/\s+/);
  let selector;
  let listenerFn;
  let returns = {
    bind: function (type, a, b) {
      bind(elem, type, a, b);
      return returns;
    }
  };
  if (typeof a === 'function') {
    listenerFn = a;
  } else if (typeof a === 'string' && typeof b === 'function') {
    selector = a;
  } else {
    // 没有定义回调函数，结束运行
    return;
  }
  // 遍历元素
  each(elems, function (node) {
    if (selector) {
      listenerFn = function (events) {
        let target = events.srcElement || events.target;
        // selector支持多个配置，如 ".side a,.nav a"
        let selectors = selector.split(/\s*,\s*/);
        let bingoDom;
        for (let i = 0, total = selectors.length; i < total; i++) {
          bingoDom = matchsSelectorBetweenNode(target, selectors[i], node);
          if (bingoDom) {
            b && b.call(bingoDom, events);
            break;
          }
        }
      };
    }
    each(types, function (eventName) {
      // false:仅监听冒泡阶段
      node.addEventListener(eventName, listenerFn, false);
    });
  });
  return returns;
}

function trigger (node, eventName) {
  let event = document.createEvent('HTMLEvents');
  event.initEvent(eventName, true, false);
  node.dispatchEvent(event);
}

function createDom (html) {
  let a = document.createElement('div');
  a.innerHTML = html;
  return a.childNodes[0];
}

// 字符化参数
function paramStringify (data, baseKey) {
  let dataArray = [];
  let key;
  let value;

  for (let i in data) {
    key = baseKey ? baseKey + '[' + i + ']' : i;
    value = data[i];

    if (value && value !== 0 && value !== '') {
      if (typeof value === 'object') {
        dataArray.push(paramStringify(data[i], key));
      } else {
        dataArray.push(key + '=' + data[i]);
      }
    }
  }
  return dataArray.join('&');
}

function fetch (param) {
  param = param || {};
  let url = param.url;
  let onResponse = param.callback || null;
  let headers = param.headers || {};
  let data = param.data;
  let dataStr = paramStringify(data);
  let method = (param.type && param.type.match(/^(get|post)$/i)) ? param.type.toUpperCase() : 'GET';
  let request = new XMLHttpRequest();

  headers.accept = 'application/json, text/javascript';
  if (method === 'POST') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  } else {
    url = dataStr.length ? (url + '?' + dataStr) : url;
    dataStr = undefined;
  }
  request.open(method, url, true);
  // 设置 headers
  for (let i in headers) {
    request.setRequestHeader(i, headers[i]);
  }
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      let resp = JSON.parse(request.responseText);
      onResponse && onResponse(null, resp, request);
    } else {
      onResponse && onResponse(request.status, request);
    }
  };

  request.onerror = function () {
    onResponse && onResponse('connection fail', request);
  };
  request.send(dataStr);
}

/**
 *
 * @param time timestamp/Date
 * @param format
 * @returns {*}
 *
 * @samples '{y}-{m}-{d} {h}:{m}:{s}'
 * @samples '{y}-{mm}-{dd} {hh}:{mm}:{ss}'
 *
 * y:year
 * m:months
 * d:date
 * h:hour
 * i:minutes
 * s:second
 * a:day
 */
function parseTime (time, format) {
  if (arguments.length === 0) {
    return null;
  }
  format = format || '{y}-{m}-{d} {h}:{i}:{s}';

  let date = typeof time === 'object' ? time : new Date(parseInt(time));

  let formatObj = {
    y: date.getYear() + 1900,
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };

  return format.replace(/{(y|m|d|h|i|s|a)+}/g, function (result, key) {
    let value = formatObj[key];
    if (result.length > 3 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
}

export default {
  queryAll: Query,
  query: function (selector, context) {
    return Query(selector, context, false);
  },
  each: each,
  parseTime: parseTime,
  offset: offset,
  createDom: createDom,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  css: CSS,
  remove: function (node) {
    node.parentNode.removeChild(node);
  },
  parents: function (node, selector) {
    if (!node || typeof selector !== 'string' || selector.split(',').length > 1) {
      return null;
    }
    return matchsSelectorBetweenNode(node, selector);
  },
  bind: bind,
  trigger: trigger,
  fetch: fetch
};
