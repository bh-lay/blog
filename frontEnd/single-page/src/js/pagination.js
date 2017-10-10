import utils from './Base.js';

/***
 * 分页 页码
 **/
function render () {
  let txt = '<ul class="pagination">';
  if (this.pageNum < 2) {
    return;
  }
  if (this.pageCur > 1) {
    txt += '<li class="pagination_prev"><a data-page="prev" href="javascript:void(0)" >上一页</a></li>';
  } else {
    txt += '<li class="pagination_prev disabled"><span>上一页</span></li>';
  }
  let btnNum = 0;
  let startNum = 0;
  if (this.pageNum > this.maxPageBtn) {
    startNum = this.pageCur - Math.floor(this.maxPageBtn / 2);
  }

  startNum = Math.max(startNum, 1);
  for (; startNum < this.pageNum + 1; startNum++) {
    if (startNum !== this.pageCur) {
      txt += '<li><a data-page="jump" href="javascript:void(0)">' + startNum + '</a></li>';
    } else {
      txt += '<li class="active"><span>' + startNum + '</span></li>';
    }
    btnNum++;
    if (btnNum >= this.maxPageBtn) {
      break;
    }
  }
  if (this.pageNum - this.pageCur >= 1) {
    txt += '<li class="pagination_next"><a data-page="next" href="javascript:void(0)">下一页</a></li>';
  } else {
    txt += '<li class="pagination_next disabled"><span>下一页</span></li>';
  }
  txt += '</ul>';
  this.dom.innerHTML = txt;
}

function pageList (dom, param) {
  param = param || {};
  let me = this;
  this.listCount = param.listCount || 0;
  this.pageCur = param.pageCur || 1;
  this.pageListNum = param.pageListNum || 15;
  this.pageNum = Math.ceil(this.listCount / this.pageListNum);
  this.maxPageBtn = param.maxPageBtn || 50;
  this.jump = null;
  this.dom = document.createElement('div');

  utils.bind(this.dom, 'click', 'a', function (e) {
    let num;
    let page = this.getAttribute('data-page');
    switch (page) {
      case 'next':
        me.jumpTo(++me.pageCur);
        break;
      case 'prev':
        me.jumpTo(--me.pageCur);
        break;
      default:
        // 'jump':
        num = parseInt(this.innerHTML);
        me.pageCur = num - 1;
        me.jumpTo(num);
    }
    e.preventDefault();
  });
  dom.innerHTML = '';
  dom.appendChild(this.dom);
  render.call(this);
}

pageList.prototype = {
  jumpTo: function (num) {
    this.pageCur = num;
    render.call(this);
    this.jump && this.jump(num);
  }
};
export default pageList;
