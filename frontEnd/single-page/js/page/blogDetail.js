/**
 * blog detail
 *
 */
define([
  'js/Base',
  '/js/highlight.js',
  '/js/showdown.js',
  'comments/index'
],function(utils,hljs,showdown,comments){
  var empty_tpl = '<div class="blank-content"><p>博文不存在</p></div>',
      template = __inline('/tpl/blogDetailPage.html');

  function getData(id,fn){
    utils.fetch({
      url : '/ajax/blog',
      data : {
        act : 'get_detail',
        id : id
      },
      callback :function(err,data){
        if(data.code == 200){
          var converter = new showdown.converter(),
              detail = data['detail'];
          detail.content = converter.makeHtml(detail.content);
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
        dom.innerHTML = empty_tpl;
        return;
      }

      setTitle && setTitle(detail.title);
      dom.innerHTML = juicer(template,detail);

      //代码高亮
      utils.each(utils.queryAll('pre',dom),function(node){
        hljs.highlightBlock(node);
      });

      new comments.init(utils.query('.comments_frame',dom),'blog-' + id,{
        list_num: 8
      });
    });
  };
});
