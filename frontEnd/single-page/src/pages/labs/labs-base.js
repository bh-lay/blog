/**
 * labs list
 *
 */

import './labs.less';
import utils from '../../js/Base.js';
import juicer from '../../js/juicer.js';

let emptyTpl = '<div class=\'blank-content\'><p>啥都木有</p></div>';
let baseTpl = require('./labsListBase.html');
let itemTemp = require('../../commons/templates/postListItem.html');


let initDefaultData = {
  subNav: [
    {
      value: '前端实验室',
      href: '/labs'
    },
    {
      value: '720全景',
      href: '/720'
    },
    {
      value: '摄影',
      href: '/photography'
    }
  ],
  pageClass: '',
  activeSubNavIndex: -1,
  thirdProfile: {
    url: '#',
    title: '',
    intro: ''
  }
};

function paramMerge (options, defaults) {
  options = options || {};
  let returns = {};
  for (let key in defaults) {
    if (!defaults.hasOwnProperty(key)) {
      return
    }
    returns[key] = options.hasOwnProperty(key) ? options[key] : defaults[key];
  }
  return returns;
}
class LabsBase {
  constructor (node, param) {
    this.node = node;
    this.options = paramMerge(param, initDefaultData);
    this.init();
  }

  init () {
    this.node.innerHTML = juicer(baseTpl, this.options);
  }

  renderList (list) {
    utils.query('.labsList', this.node).innerHTML = juicer(itemTemp, {
      list: list
    });
  }

  renderEmpty () {
    utils.query('.labsList', this.node).innerHTML = emptyTpl;
  }
}

export default LabsBase;
