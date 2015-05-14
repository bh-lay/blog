
define(function(require){
  var PageList = require('admin/react-build/pageList.js'),
      parseTime = require('admin/tools/parseTime.js');
  
  var Comment = React.createClass({displayName: "Comment",
    render: function() {
      var user;
      if(this.props.user){
        user = React.createElement("span", null, 
            React.createElement("i", {className: "glyphicon glyphicon-user"}), React.createElement("span", null, this.props.user.username), 
            React.createElement("i", {className: "glyphicon glyphicon-home"}), React.createElement("span", null, this.props.user.blog), 
            React.createElement("i", {className: "glyphicon glyphicon-envelope"}), React.createElement("span", null, this.props.user.email)
        );
      }else {
        user = React.createElement("span", null, React.createElement("strong", null, "UID"), React.createElement("span", null, this.props.uid));
      }
      var time = parseTime(this.props.time);
      return (
        React.createElement("li", {className: "list-group-item clearfix", "data-uid": this.props.uid, "data-cid": this.props.cid}, 
          React.createElement("div", {className: "comm_header"}, 
            React.createElement("strong", null, "CID"), React.createElement("span", null, this.props.cid), 
            user, 
            React.createElement("div", {className: "dropdown pull-right"}, 
              React.createElement("small", null, React.createElement("i", {className: "glyphicon glyphicon-time"}), time), 
              React.createElement("a", {className: "btn btn-xs", title: "删除", href: "/ajax/comments/del?id=" + this.props._id, "data-item-selector": ".list-group-item", "data-action-del": "三思啊，删了可就没啦！"}, 
                React.createElement("i", {className: "glyphicon glyphicon-remove"})
              )
            )
          ), 
          React.createElement("p", {dangerouslySetInnerHTML: {__html: this.props.children}})
        )
      );
    }
  });

  var CommentList = React.createClass({displayName: "CommentList",
    render: function() {
      var commentNodes = this.props.list.map(function(comment, index) {
        return (
          React.createElement(Comment, {_id: comment._id, uid: comment.uid, cid: comment.cid, time: comment.time, key: index, user: comment.user}, 
            comment.content
          )
        );
      });
      return (
        React.createElement("ul", {className: "list-group commentsList"}, 
          commentNodes
        )
      );
    }
  });

  var CommentBox = React.createClass({displayName: "CommentBox",
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
          isadmin: true,
          skip : skip,
          limit : this.state.limit
        },
        success: function(json) {
          this.setState({
            list: json.data.list,
            count: json.data.count
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
        React.createElement("div", {className: "commentBox"}, 
          React.createElement(CommentList, {list: this.state.list}), 
          React.createElement(PageList, {page: this.state.page, count: this.state.count, limit: this.state.limit, onPageChange: this.onPageChange})
        )
      );
    }
  });

  return function (elem){
    elem = elem[0];
    React.render(
      React.createElement(CommentBox, {url: "/ajax/comments/list"}),
      elem
    );
  }
  
});