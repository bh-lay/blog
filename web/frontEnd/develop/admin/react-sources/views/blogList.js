define(function(require){
  var PageList = require('admin/react-build/pageList.js'),
      parseTime = require('admin/tools/parseTime.js');
  
  var Item = React.createClass({
    render: function() {
      var time = parseTime(this.props.time);
      return (
        <tr>
          <td><a title="查看博文" href={"/blog/" + this.props.id} target="_blank">{this.props.title}</a></td>
          <td>{time}</td>
          <td>
            <a className="btn btn-default btn-xs custom-publish" title="修改" href="javascript:void(0)" data-type="article" data-id={this.props.id}><span className="glyphicon glyphicon-edit"></span></a>
            <a className="btn btn-default btn-xs" title="删除" href={'/ajax/del?from=blog&id=' + this.props.id} data-item-selector="tr" data-action-del="三思啊，删了可就没啦！"><span className="glyphicon glyphicon-remove"></span></a>
          </td>
        </tr>
      );
    }
  });

  var BlogList = React.createClass({
    render: function() {
      var commentNodes = this.props.list.map(function(blog, index) {
        return (
          <Item _id={blog._id} id={blog.id} time={blog.time_show} title={blog.title} key={index}/>
        );
      });
      return (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>标题</th><th>发布时间</th><th>操作</th>
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
      var skip = (this.state.page-1) * this.state.limit;
      $.ajax({
        url: '/ajax/blog',
        dataType: 'json',
        data: {
          act : 'get_list',
          skip : skip,
          limit : this.state.limit
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
             <a className="btn btn-default custom-publish" href="javascript:void(0)" data-type="article">写博文</a>
          </div>
          <div className="col-md-12">
            <div className="panel panel-default">
              <BlogList list={this.state.list} />
            </div>
          </div>
          <div className="col-md-12">
            <PageList page={this.state.page} count={this.state.count} limit={this.state.limit} onPageChange={this.onPageChange}/>
          </div>
        </div>
      );
    }
  });

  return function (elem){
    React.render(<BlogPage />, elem[0]);
  }
  
});