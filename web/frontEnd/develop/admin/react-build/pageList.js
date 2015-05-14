define(function(){
  var PageList = React.createClass({displayName: "PageList",
    jumpTo : function(e){
      var page = parseInt(e.target.getAttribute('data-page'));
      this.props.onPageChange(page)
    },
    render: function() {
      var list_count = this.props.count,
          page_cur = this.props.page || 1,
          page_list_num = this.props.limit || 10,
          page_num = Math.ceil(list_count / page_list_num),
          max_page_btn = 6;
      
      var pageNodes = [],
          btn_num = 0,
          start_num = page_num > max_page_btn ? page_cur - Math.floor(max_page_btn/2) : 0;
      
      pageNodes.push(page_cur > 1 ? React.createElement("li", {key: "prev"}, React.createElement("a", {onClick: this.jumpTo, "data-page": page_cur-1, href: "javascript:void(0)"}, "上一页")) : React.createElement("li", {className: "disabled", key: "prev"}, React.createElement("span", null, "上一页")));

      start_num = Math.max(start_num,1);
      for(; start_num < page_num + 1; start_num++) {
        if(start_num != page_cur){
          pageNodes.push(React.createElement("li", {key: start_num}, React.createElement("a", {href: "javascript:void(0)", "data-page": start_num, onClick: this.jumpTo}, start_num)));
        }else{
          pageNodes.push(React.createElement("li", {key: start_num, className: "active"}, React.createElement("span", null, start_num)));
        }
        btn_num++;
        if(btn_num >= max_page_btn){
          break;
        }
      }
      pageNodes.push(page_num - page_cur >= 1 ? React.createElement("li", {key: "next"}, React.createElement("a", {onClick: this.jumpTo, "data-page": page_cur+1, href: "javascript:void(0)"}, "下一页")) : React.createElement("li", {className: "disabled", key: "next"}, React.createElement("span", null, "下一页")));
      return (
        React.createElement("ul", {className: "pagination"}, pageNodes)
      );
    }
  });
  return PageList;
});