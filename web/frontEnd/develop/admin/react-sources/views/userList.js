define(function(require){
  
  var Item = React.createClass({
    render: function() {
      return (
        <tr>
          <td>{this.props.username}</td>
          <td>{this.props.email}</td>
          <td>{this.props.user_group}</td>
          <td>
            <a className="btn btn-default btn-xs custom-publish" title="修改" href="javascript:void(0)" data-type="user" data-id={this.props.id}><span className="glyphicon glyphicon-edit"></span></a>
            <a className="btn btn-default btn-xs" title="删除" href={'/ajax/del?from=user&id=' + this.props.id} data-item-selector="tr" data-action-del="三思啊，删了可就没啦！"><span className="glyphicon glyphicon-remove"></span></a>
          </td>
        </tr>
      );
    }
  });

  var OpusList = React.createClass({
    render: function() {
      var commentNodes = this.props.list.map(function(user, index) {
        return (
          <Item _id={user._id} id={user.id} user_group={user.user_group} email={user.email} username={user.username} key={index}/>
        );
      });
      return (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>标题</th><th>邮箱</th><th>用户组</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
            {commentNodes}
          </tbody>
        </table>
      );
    }
  });

  var BlogPage = React.createClass({
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
        <div>
          <div className="col-md-12 custom-mb10">
             <a className="btn btn-primary btn-sm custom-lofox" href="/admin/publish/user">增加用户</a>
          </div>
          <div className="col-md-12">
            <div className="panel panel-default">
              <OpusList list={this.state.list} />
            </div>
          </div>
        </div>
      );
    }
  });

  return function (elem){
    elem = elem[0];
    React.render(
      <BlogPage url='/ajax/user' />,
      elem
    );
  }
  
});