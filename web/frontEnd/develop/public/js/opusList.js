/**
 * opus list
 *  
 */
define(function(require,exports){
	var pagination = require('util/pagination.js');
  var empty_tpl = '<div class="blank-content"><p>啥都木有</p></div>';
	
  function getData(skip,limit,callback){
		$.ajax({
			type : 'GET' ,
			url : '/ajax/opus',
			data : {
				act : 'get_list',
				skip : skip,
				limit : limit
			},
			success :function(data){
				var count = data['count'],
					 list = data['list'];
        if(data.code == 500){
          callback && callback(500);
          return
        }
				for(var i = 0,total = list.length;i<total;i++){
					list[i]['work_range'] = list[i]['work_range']?list[i]['work_range'].split(/\,/):['暂未填写'];
          //使用七牛图床
					list[i].cover = L.qiniu(list[i].cover);
				}
				callback && callback(null,list,count);
			}
		});
	}
	
  function LIST(dom,tag){
    this.skip = 0;
    this.limit = 10;
    this.count = 0;
    this.dom = dom;
  }
  LIST.prototype.renderPage = function(index,callback){
    var me = this;
    this.skip = (index-1 || 0) * this.limit;
    var list_tpl = $('#tpl_opus_list_item').html();
    
    getData(this.skip,this.limit,function(err,list,count){
      console.log(arguments);
      if(!err && list.length){
        me.count = count;
        me.skip += me.limit;
        var html = juicer(list_tpl,{
            list : list
        });
        me.dom.html(html);
      }else{
        me.dom.html(empty_tpl);
      }
      callback && callback.call(me);
    });
  };
	return function(dom,param){
		var me = this,
        param = param || {};
		var base_tpl = $('#tpl_opus_list_base').html();
    var base_tpl_end = L.tplModule(base_tpl);
    
    //插入基本模版
    dom.html(base_tpl_end);
    this.$list = dom.find('.opusList');
    this.$page_cnt = dom.find('.pagination_cnt');
    
    //获取当前页数
		this.pageIndex = param.page || 1;
    
     //创建列表对象
    var list = new LIST(this.$list);
    //渲染初始页
		list.renderPage(this.pageIndex,function(){
			//分页组件
			var page = new pagination(me.$page_cnt,{
				list_count : list.count,
				page_cur : me.pageIndex,
				page_list_num : list.limit,
				max_page_btn : 6
			});
			page.jump = function(num){
				var newUrl = '/opus?page=' + num;
        L.push(newUrl);
				L.refresh();
			};
		});
	};
});