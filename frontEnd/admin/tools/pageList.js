/***
 * 分页 页码
 **/

define(function(){
  function pageListRender(){
    var txt = '';

    if (this.page_cur > 1) {
      txt += '<li><a data-page="prev" href="javascript:void(0)" >上一页</a></li>';
    }else{
      txt += '<li class="disabled"><span>上一页</span></li>';
    }
    var btn_num = 0;
    var start_num = 0;
    if(this.page_num > this.max_page_btn){
      start_num =  this.page_cur - Math.floor(this.max_page_btn/2);
    }


    start_num = Math.max(start_num,1);
    for(; start_num < this.page_num + 1; start_num++) {
      if(start_num != this.page_cur){
        txt += '<li><a data-page="jump" href="javascript:void(0)">' + start_num + '</a></li>';
      }else{
        txt += '<li class="active"><span>'+ start_num +'</span></li>';
      }
      btn_num++;
      if(btn_num >= this.max_page_btn){
        break;
      }
    }
    if (this.page_num - this.page_cur >= 1) {
      txt += '<li><a data-page="next" href="javascript:void(0)">下一页</a></li>';
    }else{
      txt += '<li class="disabled"><span>下一页</span></li>';
    }
    this.dom.html(txt);
  }
  function pageList(dom,param){
    var param = param || {};
    var this_page = this;
    this.list_count = param.list_count || 0;
    this.page_cur = param.page_cur || 1;
    this.page_list_num = param.page_list_num || 15;
    this.page_num = Math.ceil(this.list_count / this.page_list_num);
    this.max_page_btn = param.max_page_btn || 50;
    this.jump = null;
    this.dom = $('<ul class="pagination"></ul>');

    this.dom.on('click','a[data-page="jump"]',function(){
      var num = parseInt($(this).html());
      this_page.page_cur = num - 1;
      this_page.jumpTo(num);
    }).on('click','a[data-page="next"]',function(){
      var num = ++this_page.page_cur;
      this_page.jumpTo(num);
    }).on('click','a[data-page="prev"]',function(){
      var num = --this_page.page_cur;
      this_page.jumpTo(num);
    });
    dom.html(this.dom);
    pageListRender.call(this);
  }
  pageList.prototype = {
    'jumpTo' : function(num){
      this.page_cur = num;
      pageListRender.call(this);
      this.jump && this.jump(num);
    }
  };
  return function(dom,param){
      return new pageList(dom,param);
  };
});