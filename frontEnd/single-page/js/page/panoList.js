/**
 * labs list
 *
 */
define([
  'js/Base',
  'js/imageHosting',
  'js/juicer',
  'js/publicTemplate'
],function(utils, imageHosting, juicer, publicTemplate){
  var empty_tpl = '<div class="blank-content"><p>啥都木有</p></div>',
      base_tpl = __inline('/tpl/panoListBase.html'),
      item_temp = publicTemplate.postListItem;

  var getData = function(callback){
    utils.fetch({
      type : 'GET' ,
      url : '/ajax/pano/list',
      data : {
        act : 'get_list'
      },
      callback :function(err, data){
        if(err || data.code == 500){
          callback && callback(500);
          return;
        }

        callback&&callback(null, filterData(data.products));
      }
    });
  };
  function filterData(list){
    list.forEach(function (item) {
      item.title = item.name;
      item.url = 'http://720yun.com/t/' + item.pid;
    });
    return list;
  }
  return function(global, param){
    var node = global.node;

    node.innerHTML = base_tpl;

    getData(function(err,list){
      var this_html;
      if(err){
        this_html = empty_tpl;
      }else{
        this_html = juicer(item_temp,{
          list : list
        });
      }
      utils.query('.panoList',node).innerHTML = this_html;
    });
  };
});
