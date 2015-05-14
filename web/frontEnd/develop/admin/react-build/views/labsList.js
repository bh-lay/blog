define(function(require){
  var PageList = require('admin/react-build/pageList.js'),
      parseTime = require('admin/tools/parseTime.js');
  
  var Item = React.createClass({displayName: "Item",
    render: function() {
      var time = parseTime(this.props.time);
      return (
        React.createElement("tr", null, 
          React.createElement("td", null, React.createElement("a", {title: "查看轮子", href: "/labs/" + this.props.name, target: "_blank"}, this.props.title)), 
          React.createElement("td", null, time), 
          React.createElement("td", null, 
            React.createElement("a", {className: "btn btn-default btn-xs custom-publish", title: "修改", href: "javascript:void(0)", "data-type": "labs", "data-id": this.props.id}, React.createElement("span", {className: "glyphicon glyphicon-edit"})), 
            React.createElement("a", {className: "btn btn-default btn-xs", title: "删除", href: '/ajax/del?from=labs&id=' + this.props.id, "data-item-selector": "tr", "data-action-del": "三思啊，删了可就没啦！"}, React.createElement("span", {className: "glyphicon glyphicon-remove"}))
          )
        )
      );
    }
  });

  var LabsList = React.createClass({displayName: "LabsList",
    render: function() {
      var commentNodes = this.props.list.map(function(labs, index) {
        return (
          React.createElement(Item, {_id: labs._id, id: labs.id, time: labs.time_create, name: labs.name, title: labs.title, key: index})
        );
      });
      return (
        React.createElement("table", {className: "table table-hover"}, 
          React.createElement("thead", null, 
            React.createElement("tr", null, 
              React.createElement("th", null, "标题"), React.createElement("th", null, "发布时间"), React.createElement("th", null, "操作")
            )
          ), 
          React.createElement("tbody", null, 
            commentNodes
          )
        )
      );
    }
  });

  var BlogPage = React.createClass({displayName: "BlogPage",
    getInitialState: function() {
      return {
        list: [],
        count: 0,
				page : 1,
				limit : 8
      };
    },
    onPageChange: function(num){
      this.setState({
        page: num
      },function(){
        this.loadCommentsFromServer();
      }.bind(this));
    },
    loadCommentsFromServer: function() {
      var skip = (this.state.page-1) * this.state.limit;
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        data: {
          act : 'get_list',
          skip : skip,
          limit : this.state.limit
        },
        success: function(json) {
          this.setState({
            list: json.list,
            count: json.count
          });
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
    componentDidMount: function() {
      this.loadCommentsFromServer();
    },
    render: function() {
      return (
        React.createElement("div", null, 
          React.createElement("div", {className: "col-md-12 custom-mb10"}, 
             React.createElement("a", {className: "btn btn-default custom-publish", href: "javascript:void(0)", "data-type": "labs"}, "发插件")
          ), 
          React.createElement("div", {className: "col-md-12"}, 
            React.createElement("div", {className: "panel panel-default"}, 
              React.createElement(LabsList, {list: this.state.list})
            )
          ), 
          React.createElement("div", {className: "col-md-12"}, 
            React.createElement(PageList, {page: this.state.page, count: this.state.count, limit: this.state.limit, onPageChange: this.onPageChange})
          )
        )
      );
    }
  });

  return function (elem){
    elem = elem[0];
    React.render(
      React.createElement(BlogPage, {url: "/ajax/labs"}),
      elem
    );
  }
  
});