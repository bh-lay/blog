/**
 * blog detail
 *
 */
define([
  'js/Base',
  '/js/highlight.js',
  'comments/index'
],function(utils,hljs,comments){
  var template = __inline('/tpl/blogDetailPage.html');

  function getData(id,fn){
    utils.fetch({
      url : '/ajax/blog',
      data : {
        act : 'get_detail',
        format : 'html',
        id : id
      },
      callback :function(err,data){
        if(!err && data && data.code == 200){
          var detail = data['detail'];
          detail.time_show = utils.parseTime(detail.time_show,'{y}-{mm}-{dd}');

          fn&&fn(null,detail);
        }else{
          fn&&fn('博客不存在！');
        }
      }
    });
  };

  return function(dom,id,setTitle){
    getData(id,function(err,detail,title){
      if(err && !detail){
        L.push('/');
        L.refresh();
        return;
      }

      setTitle && setTitle(detail.title);
      dom.innerHTML = juicer(template,detail);

      //代码高亮
      utils.each(utils.queryAll('pre code',dom),function(node){
        hljs(node);
      });

      new comments.init(utils.query('.comments_frame',dom),'blog-' + id,{
        list_num: 8
      });
    });
  };
});
