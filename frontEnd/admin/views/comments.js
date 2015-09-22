
/**
 * 评论列表页
 * @param {Object} dom
 * @param {String|Number} [id] article ID
 **/
define(function(require){
  var pageList = require('tools/pageList.js'),
      parseTime = require('tools/parseTime.js');
  //获取文章列表
  function getList(start,limit,callback){
    $.ajax({
      url : '/ajax/comments/list',
      type : 'GET',
      data : {
        isadmin: true,
        skip : start,
        limit : limit
      },
      success : function(d){
        var data = d.data;
        for(var i in data.list){
          data.list[i].url = data.list[i].cid == 'define-1' ? '/bless' : '/' + data.list[i].cid.replace(/\-/g,'/');
          data.list[i].url += '#comments-' + data.list[i]._id;
          data.list[i].time = parseTime(data.list[i].time,'{y}年 {m}月 {d}日 {h}:{i}');
        }
        callback(null,data);  
      }
    });
  }
  function listPage(dom){
    //每页显示条数
    var page_list_num = 8;
    var tpl = $('#tpl_comments_page').html();
    dom.html('<div class="list_cnt"></div><div class="page_cnt"></div>');
    var $list_cnt = dom.find('.list_cnt');
    var $page_cnt = dom.find('.page_cnt');
    getList(0,page_list_num,function(err,data){
      if(err){
        return;
      }
      var list_html = juicer(tpl,data);
      
      $list_cnt.html(list_html);
      //分页组件
      var page = new pageList($page_cnt,{
        'list_count' : data.count,
        'page_cur' : 0,
        'page_list_num' : page_list_num,
        'max_page_btn' : 8
      });
      page.jump = function(num){
        getList((num-1)*page_list_num,page_list_num,function(err,data){
          if(err){
            return;
          }
          var list_html = juicer(tpl,data);
          $list_cnt.html(list_html);
        });
      };
    });
  }
  
  return listPage;
});