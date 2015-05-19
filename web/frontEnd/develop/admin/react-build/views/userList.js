define(function(require){
  
  var Item = React.createClass({displayName: "Item",
    render: function() {
      return (
        React.createElement("tr", null, 
          React.createElement("td", null, this.props.username), 
          React.createElement("td", null, this.props.email), 
          React.createElement("td", null, this.props.user_group), 
          React.createElement("td", null, 
            React.createElement("a", {className: "btn btn-default btn-xs custom-publish", title: "修改", href: "javascript:void(0)", "data-type": "user", "data-id": this.props.id}, React.createElement("span", {className: "glyphicon glyphicon-edit"})), 
            React.createElement("a", {className: "btn btn-default btn-xs", title: "删除", href: '/ajax/del?from=user&id=' + this.props.id, "data-item-selector": "tr", "data-action-del": "三思啊，删了可就没啦！"}, React.createElement("span", {className: "glyphicon glyphicon-remove"}))
          )
        )
      );
    }
  });

  var OpusList = React.createClass({displayName: "OpusList",
    render: function() {
      var commentNodes = this.props.list.map(function(user, index) {
        return (
          React.createElement(Item, {_id: user._id, id: user.id, user_group: user.user_group, email: user.email, username: user.username, key: index})
        );
      });
      return (
        React.createElement("table", {className: "table table-hover"}, 
          React.createElement("thead", null, 
            React.createElement("tr", null, 
              React.createElement("th", null, "标题"), React.createElement("th", null, "邮箱"), React.createElement("th", null, "用户组"), React.createElement("th", null, "操作")
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
      $.ajax({
        url: '/ajax/user/list',
        dataType: 'json',
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
             React.createElement("a", {className: "btn btn-primary btn-sm custom-lofox", href: "/admin/publish/user"}, "增加用户")
          ), 
          React.createElement("div", {className: "col-md-12"}, 
            React.createElement("div", {className: "panel panel-default"}, 
              React.createElement(OpusList, {list: this.state.list})
            )
          )
        )
      );
    }
  });

  return function (elem){
    elem = elem[0];
    React.render(
      React.createElement(BlogPage, {url: "/ajax/user"}),
      elem
    );
  }
  
});