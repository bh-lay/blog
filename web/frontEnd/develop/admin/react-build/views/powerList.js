define(function(require){
  
  var Item = React.createClass({displayName: "Item",
    render: function() {
      return (
        React.createElement("tr", null, 
          React.createElement("td", null, this.props.id), 
          React.createElement("td", null, this.props.name), 
          React.createElement("td", null, this.props.discription), 
          React.createElement("td", null, 
            React.createElement("a", {className: "btn btn-default btn-xs custom-publish", title: "修改", href: "javascript:void(0)", "data-type": "power", "data-id": this.props.id}, React.createElement("span", {className: "glyphicon glyphicon-edit"})), 
            React.createElement("a", {className: "btn btn-default btn-xs", title: "删除", href: '/ajax/del?from=power&id=' + this.props.id, "data-item-selector": "tr", "data-action-del": "三思啊，删了可就没啦！"}, React.createElement("span", {className: "glyphicon glyphicon-remove"}))
          )
        )
      );
    }
  });

  var OpusList = React.createClass({displayName: "OpusList",
    render: function() {
      var commentNodes = this.props.list.map(function(cmt, index) {
        return (
          React.createElement(Item, {id: cmt.id, name: cmt.name, discription: cmt.discription, key: index})
        );
      });
      return (
        React.createElement("table", {className: "table table-hover"}, 
          React.createElement("thead", null, 
            React.createElement("tr", null, 
              React.createElement("th", null, "ID"), React.createElement("th", null, "权限名"), React.createElement("th", null, "权限描述"), React.createElement("th", null, "操作")
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
			 'url' : '/ajax/power',
        dataType: 'json',
        data: {
				  'act' : 'get_list',
        },
        success: function(json) {
          if(json.list){
            this.setState({
              list: json.list,
              count: json.count
            });
          }
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
             React.createElement("a", {className: "btn btn-primary btn-sm custom-lofox", href: "/admin/publish/power"}, "加权限")
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
      React.createElement(BlogPage, null),
      elem
    );
  }
  
});