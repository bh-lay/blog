/**
 * labs list
 *
 */


import utils from "../Base.js";
import imageHosting from "./js/imageHosting.js";
import juicer from "./js/juicer.js";
import publicTemplate from "./js/publicTemplate.js";

var empty_tpl = '<div class="blank-content"><p>啥都木有</p></div>',
    base_tpl = __inline('/tpl/labsListBase.html'),
    item_temp = publicTemplate.postListItem;

var limit = 20,
    skip = 0,
    count = null,
    dom;
var getData = function(callback){
  utils.fetch({
    type : 'GET' ,
    url : '/ajax/labs',
    data : {
      act : 'get_list',
      skip : skip,
      limit : limit
    },
    callback :function(err,data){
      if(err || data.code == 500){
        callback && callback(500);
        return;
      }
      count = data['count'];
      skip += limit;

      var list = data['list'];
      callback&&callback(null,filterData(list));
    }
  });
};
function filterData(list){
  list.forEach(function (item) {
    //使用七牛图床
    item.thumb = imageHosting(item.cover,{
      type : 'cover',
      width : 400,
      height: 400
    });
    item.desc = item.intro;
    item.url = '/labs/' + item.name;
    item.star = item.github.stargazers_count;
    item.fork = item.github.forks_count;
  });
  return list;
}
return function(global,param){
  var node = global.node;
  skip = 0;
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
    utils.query('.labsList',node).innerHTML = this_html;
  });
};