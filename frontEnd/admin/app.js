/**
 * @author bh-lay
 * 后台主js文件
 * 
 */

window.admin = window.admin || {};

function globalEvents(){
  /**
   * ajax交互
   *
   **/
  function sendPOST(url,callback){
    $.ajax({
      url : url,
      type : 'POST',
      success : function(data){
        if(data && data.code == 200){
          callback && callback(null,'操作成功');
        }else{
          var msg = data.msg || '操作失败';
          callback && callback(msg);
        }
      },
      error : function(){
        callback && callback('网络出错！');
      }
    });
  }
  $('body').on('click','a[data-action-ajaxConfirm]',function(){
    var btn = $(this);
    var url = btn.attr('href');
    var text = btn.attr('data-action-ajaxConfirm');
    UI.confirm({
      text : text,
      callback : function(){
        sendPOST(url,function(err,msg){
          if(err){
            UI.prompt(err);
          }else{
            UI.prompt('操作成功！');
          }
        });
      }
    });
    return false;
  }).on('click','a[data-action-del]',function(){
    var btn = $(this);
    var url = btn.attr('href');
    var text = btn.attr('data-action-del');
    var item_selector = btn.attr('data-item-selector');
    var item = btn.parents(item_selector);
    UI.confirm({
      text : text,
      callback : function(){
        sendPOST(url,function(err,msg){
          if(err){
            UI.prompt(err);
          }else{
            item.fadeTo(400,0.1,function(){
              item.slideUp(200,function(){
                item.remove();
              });
            });
          }
        });
      }
    });
    return false;
  }).on('click','a[data-action-ajax]',function(){
    var btn = $(this);
    var url = btn.attr('href');
    var text = btn.attr('data-action-ajax');
    $.ajax({
      url : url,
      type : 'POST',
      success : function(data){
        if(data && data.code ==200){
          UI.prompt(text);
        }else{
          UI.prompt('操作失败！');
        }
      },
      error : function(){
        UI.prompt('网络出错！');
      }
    });
    return false;
  });
}
/**
 * @method admin.push
 * 	@param {String} url,the location url needn't '/p/'
 * 	@example 
 * 		admin.push('vote'); //'vote' is means '/p/vote'
 * 
 * @method admin.refresh
 * 	@example admin.refresh();
 * 
 **/

define(function(require,exports){
  require('lofox.js');
	require('dialog.js');
  require('juicer.js');

  var views = {
    index : require('views/index.js'),
    labs : require('views/labs.js'),
    blog : require('views/blog.js'),
    links : require('views/links.js'),
    users : require('views/users.js'),
    comments : require('views/comments.js'),
    power : require('views/power.js')
  };
	function createDom(dom){
		var oldDom = dom.find('.mainCnt_body');
		var newDom = $('<div class="mainCnt_body"><div><div class="pro_loading">正在加载</div></div></div>');
		
		dom.append(newDom);
		if(oldDom.length != 0){
			dom.css('height',dom.height());
			
			newDom.css({
				position : 'absolute',
				top : 0,
				left: '200%'
			});
			oldDom.css({
				position : 'absolute',
				top: 0,
				left : 0
			}).animate({
				left: '-100%'
			},400).fadeOut(100,function(){
				$(window).scrollTop(0);
				oldDom.remove();
				newDom.animate({
					left: 0
				},200,function(){
					dom.css('height','auto');
					newDom.css('position','relative');
				});
			});
		}
		return newDom;
	}
  var lofox = util.lofox();
  var mainDom = $('.mainCnt');
  var titleDom = $('title');
  globalEvents();

  //首页
  lofox.set('/admin/',function(){
    this.title('后台首页');
    var dom = createDom(mainDom);
    views.index(dom);
  });
  //博文页
  lofox.set('/admin/article',function(){
      this.title('博文列表');
      var dom = createDom(mainDom);
      views.blog(dom);
  });
  //实验室
  lofox.set('/admin/labs',function(){
      this.title('实验室');
      var dom = createDom(mainDom);
      views.labs(dom);
  });
  //用户列表页
  lofox.set('/admin/user/list',function(){
      this.title('用户列表');
      var dom = createDom(mainDom);
      views.users(dom);
  });
  //用户组页
  lofox.set('/admin/user/group',function(){
      this.title('用户组列表');
      var dom = createDom(mainDom);
      dom.html('俺是用户组列表页');
  });
  //权限页
  lofox.set('/admin/user/power',function(){
      this.title('权限页');
      var dom = createDom(mainDom);
      views.power(dom);
  });

  //友情链接模块
  lofox.set('/admin/friends',function(){
      this.title('友情链接');
      var dom = createDom(mainDom);
      views.links(dom);
  });
  //图库
  lofox.set('/admin/gallery',function(){
      this.title('图库');

      var domCnt = createDom(mainDom);
      domCnt.html('<div class="col-md-12"></div>');
      var dom = domCnt.find('.col-md-12');
      seajs.use('gallery/index.js',function(gallery){
          gallery.init(dom);
      });
  });
  //评论管理
  lofox.set('/admin/comments',function(){
      this.title('评论管理');
      var domCnt = createDom(mainDom);
      domCnt.html('<div class="col-md-12"></div>');
      var dom = domCnt.find('.col-md-12');
      new views.comments(dom);
  });
  //发布相关
  lofox.set([
      '/admin/publish/',
      '/admin/publish/{type}',
      '/admin/publish/{type}/{id}'
  ],function(data){
      this.title('发布台');
      var domCnt = createDom(mainDom);
      domCnt.html('<div class="col-md-12"></div>');
      var dom = domCnt.find('.col-md-12');
      var type = data.type || null;
      var id = data.id || null;

      if(type && type.match(/^(article|friends|labs|power|user)$/)){
          seajs.use('publish/publish.js',function(publish){
              publish.init(dom,{
                  'active' : type,
                  'id' : id,
                  'sendFn' : function(){
                      location.back();
                  }
              });
          });
      }else{
          admin.push('/publish/article');
          admin.refresh();
      }
  });

  lofox.rest(function(){
      admin.push('');
      admin.refresh();
  })

  $('body').on('click','a.custom-lofox',function(){
      var url = $(this).attr('href');
      lofox.push(url);
      lofox.refresh();
      return false
  }).on('click','a.custom-publish',function(){
      var btn = $(this);
      var type = btn.attr('data-type');
      var id = btn.attr('data-id');
      seajs.use('publish/publish.js',function(publish){
          var cover = UI.cover({
              from : btn[0],
              easyClose: false,
              html : '<div class="container my-publish-cnt"></div>'
          });
          publish.init($(cover.dom).find('.my-publish-cnt'),{
              'active' : type,
              'id' : id,
              'sendFn' : function(){
                  setTimeout(function(){
                      cover.close();
                  },1000);
              }
          });
      });
      return false;
  });

  window.admin = window.admin || {};

  window.admin.push = function(url){
    //去除参数中的首个‘/’或‘/admin/’
    var new_url = '/admin/' + (url ? url.replace(/^(\/admin\/|\/)/,'') : '');
    lofox.push.call(lofox,new_url);
  };
  window.admin.refresh = function(){
    lofox.refresh();
  };
});