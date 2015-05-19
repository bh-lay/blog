define(function(require){
  
  var Item = React.createClass({
    render: function() {
      return (
        <tr>
          <td>{this.props.id}</td>
          <td>{this.props.name}</td>
          <td>{this.props.discription}</td>
          <td>
            <a className="btn btn-default btn-xs custom-publish" title="修改" href="javascript:void(0)" data-type="power" data-id={this.props.id}><span className="glyphicon glyphicon-edit"></span></a>
            <a className="btn btn-default btn-xs" title="删除" href={'/ajax/del?from=power&id=' + this.props.id} data-item-selector="tr" data-action-del="三思啊，删了可就没啦！"><span className="glyphicon glyphicon-remove"></span></a>
          </td>
        </tr>
      );
    }
  });

  var OpusList = React.createClass({
    render: function() {
      var commentNodes = this.props.list.map(function(cmt, index) {
        return (
          <Item id={cmt.id} name={cmt.name} discription={cmt.discription} key={index}/>
        );
      });
      return (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th><th>权限名</th><th>权限描述</th><th>操作</th>
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
        <div>
          <div className="col-md-12 custom-mb10">
             <a className="btn btn-primary btn-sm custom-lofox" href="/admin/publish/power">加权限</a>
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
      <BlogPage />,
      elem
    );
  }
  
});