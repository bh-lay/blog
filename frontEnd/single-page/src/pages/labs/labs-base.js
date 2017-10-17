/**
 * labs list
 *
 */

import './labs.less';
import utils from '../../js/Base.js';
import juicer from '../../js/juicer.js';

let emptyTpl = '<div class=\'blank-content\'><p>啥都木有</p></div>';
let baseTpl = require('./labsListBase.html');
let itemTemp = require('./postListItem.html');
let potoGraphaList = [
  {
    imgSrc: require('./images/opus_@2x.jpg'),
    htmlSrc: 'https://bh-lay.tuchong.com/14431809/#image24933177',
    title: '宏村'
  }, {
    imgSrc: require('./images/yangshuo.jpg'),
    htmlSrc: 'http://720yun.com/t/544jOrkvtn0?from=bh-lay',
    title: '桂林阳朔'
  }
];
let potoGraphaIndex = -1;

let initDefaultData = {
  photography: {},
  pageClass: '',
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
    this.options.photography = potoGraphaList[++potoGraphaIndex];
    if (potoGraphaIndex + 1 >= potoGraphaList.length) {
      potoGraphaIndex = -1;
    }
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
