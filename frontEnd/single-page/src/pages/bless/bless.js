/**
 * 评论 list
 *
 */

import './bless.less';
import utils from '../../js/Base.js';
import {SendBox, List} from '../../comments/index.js';
import juicer from '../../js/juicer.js';

let commentId = 'define-1';
let baseTpl = require('./bless.html');
let potoGraphaList = [
  {
    title: '西沙湿地',
    imgSrc: require('../../images/comment_2_@2x.jpg'),
    htmlSrc: 'https://bh-lay.tuchong.com/14465332/',
  },
  {
    title: '束河古城',
    imgSrc: require('../../images/comment_@2x.jpg'),
    htmlSrc: 'https://bh-lay.tuchong.com/14591502/',
  },
];
let potoGraphaIndex = -1;

// 模块替换
function tplModule (txt) {
  return (txt && txt.length) ? txt.replace(/\[-(\w+)-\]/g, function (a, key) {
    return utils.query('#module_' + key).innerHTML || '';
  }) : '';
};

function page (global) {
  let baseTplEnd = tplModule(baseTpl);
  let node = global.node;
  node.innerHTML = juicer(baseTplEnd, {
    photography: potoGraphaList[++potoGraphaIndex]
  });
  if (potoGraphaIndex + 1 >= potoGraphaList.length) {
    potoGraphaIndex = -1;
  }
  let sendBox = new SendBox(utils.query('.bless-sendBox', node), commentId);
  let list = new List(utils.query('.grid-col-flow-300', node), commentId);
  sendBox.on('sendToServiceSuccess', function (item) {
    list.addItem(item);
  });
}

export default page;
