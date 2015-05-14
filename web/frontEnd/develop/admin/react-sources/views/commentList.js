
define(function(require){
  var PageList = require('admin/react-build/pageList.js'),
      parseTime = require('admin/tools/parseTime.js');
  
  var Comment = React.createClass({
    render: function() {
      var user;
      if(this.props.user){
        user = <span>
            <i className="glyphicon glyphicon-user"></i><span>{this.props.user.username}</span>
            <i className="glyphicon glyphicon-home"></i><span>{this.props.user.blog}</span>
            <i className="glyphicon glyphicon-envelope"></i><span>{this.props.user.email}</span>
        </span>;
      }else {
        user = <span><strong>UID</strong><span>{this.props.uid}</span></span>;
      }
      var time = parseTime(this.props.time);
      return (
        <li className="list-group-item clearfix" data-uid={this.props.uid} data-cid={this.props.cid}>
          <div className="comm_header">
            <strong>CID</strong><span>{this.props.cid}</span>
            {user}
            <div className="dropdown pull-right">
              <small><i className="glyphicon glyphicon-time"></i>{time}</small>
              <a className="btn btn-xs" title="删除" href={"/ajax/comments/del?id=" + this.props._id} data-item-selector=".list-group-item" data-action-del="三思啊，删了可就没啦！">
                <i className="glyphicon glyphicon-remove"></i>
              </a>
            </div>
          </div>
          <p dangerouslySetInnerHTML={{__html: this.props.children}} />
        </li>
      );
    }
  });

  var CommentList = React.createClass({
    render: function() {
      var commentNodes = this.props.list.map(function(comment, index) {
        return (
          <Comment _id={comment._id} uid={comment.uid} cid={comment.cid} time={comment.time} key={index} user={comment.user}>
            {comment.content}
          </Comment>
        );
      });
      return (
        <ul className="list-group commentsList">
          {commentNodes}
        </ul>
      );
    }
  });

  var CommentBox = React.createClass({
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
        <div className="commentBox">
          <CommentList list={this.state.list} />
          <PageList page={this.state.page} count={this.state.count} limit={this.state.limit} onPageChange={this.onPageChange}/>
        </div>
      );
    }
  });

  return function (elem){
    elem = elem[0];
    React.render(
      <CommentBox url="/ajax/comments/list" />,
      elem
    );
  }
  
});