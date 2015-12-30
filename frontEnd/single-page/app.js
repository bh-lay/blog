/**
 * @author:bh-lay
 * Copyright (c) 2012-2018
**/

window.L = window.L || {};

require([
  'js/user',
  'js/navigation',
  'js/Base',
  'js/routerHandle',
  'js/imageHosting',

  'js/lofox',
  'js/dialog'
], function (user,navigation,utils,routerHandle,imageHosting){
  //绑定路由
  var lofox = new util.lofox();
  routerHandle(lofox);

  L.user = user;

  L.push = function (url) {
      lofox.push(url);
  };
  L.refresh = function () {
      lofox.refresh();
  };
  /**
   * 判断是否支持css属性
   * 兼容css3
   */
  var supports = (function() {
    var styles = document.createElement('div').style,
        vendors = 'Webkit Khtml Ms O Moz'.split(/\s/);

    return function(prop) {
      if ( prop in styles ){
        return prop;
      }else{
        prop = prop.replace(/^[a-z]/, function(val) {
          return val.toUpperCase();
        });
        for(var i=0,total=vendors.length;i<total;i++){
          if ( vendors[i] + prop in styles ) {
            return ('-' + vendors[i] + '-' + prop).toLowerCase();
          }
        }
      }
    };
  })();
  //是否支持 canvas
  var supports_canvas = !!document.createElement('canvas').getContext ? true : false,
      //是否支持touch
      isSupportTouch = document.hasOwnProperty("ontouchend") ? true : false,
      //是否为windows系统
      isWindows = /windows|win32/.test(navigator.userAgent.toLowerCase()),
      //是否为高级浏览器
      isAdvancedBrowser = (supports('transition') && supports('transform') && supports_canvas) ? true : false;

  //屌丝就用屌丝版
  if (!isAdvancedBrowser) {
    document.cookie = 'ui_version=html;path=/;';
    window.location.reload();
  }
  //为windows系统定制body滚动条样式（仅webkit有效）
  if(isWindows){
    utils.addClass(utils.query('body'),'define-scrollbar');
  }
  L.isMobileBrowser = (window.innerWidth < 720 && isSupportTouch) ? true : false;

  //占用全局方法
  L.gravatar_error_fn = function(elem){
    if(elem.src.indexOf('www.gravatar.com') > -1){
      //若gravatar官网请求失败，使用多说镜像
      elem.src = elem.src.replace('www.gravatar.com','gravatar.duoshuo.com');
    }else if(elem.src.indexOf('gravatar.duoshuo.com') > -1){
      //若多说镜像失败，使用默认头像
      elem.src = __uri('/images/default.jpg');
    }
    //其余情况均不处理（已是默认头像）
  };

  //模块替换
  L.tplModule = function(txt){
    return (txt && txt.length) ? txt.replace(/\[\-(\w+)\-\]/g,function(a,key){
      return utils.query('#module_' + key).innerHTML || '';
    }) : '';
  };
  //做个好玩的
  document.addEventListener('visibilitychange', function() {
    document.title = document.hidden ? '出BUG了，快看！':'小剧客栈，剧中人的个人博客！';
  });

  document.body.addEventListener('copy', function (event) {
    var clipboardData = event.clipboardData || window.clipboardData;
    
    if (!clipboardData || !window.getSelection().toString()) {
      return;
    }
    event.preventDefault();
    var data = ['作者：剧中人',
        '来自：小剧客栈', 
        '链接：' + window.location.href,
        '',
        window.getSelection().toString()];
    clipboardData.setData('text/html', data.join('<br>'));
    clipboardData.setData('text/plain',data.join('\n'));
  });

  //动态插入emoji表情样式
  var str = '<style type="text/css" data-module="emoji">';
  (utils.query('#data_emoji').innerHTML || '').trim().split(/\s+/).forEach(function(item,index){
    str += '.emoji.s_' + item + '{background-position: -' + (index * 25) + 'px 0;}';
  });
  str += '</style>';
  utils.query('head').insertAdjacentHTML('beforeEnd', str);

  //配置弹出层
  UI.config.zIndex(2000);

  //开始导航
  navigation.init();
  //渐隐加载遮罩
  utils.addClass(utils.query('.app_mask'),'app_mask_out');
  setTimeout(function () {
    utils.remove(utils.query('.app_mask'));
  }, 1000);

  /**
   * 检测链接是否为提供给js使用的地址
   *   无地址、 javascript:: 、javascript:void(0)、#
   **/
  function hrefForScript(href){
    return (href.length == 0 || href.match(/^(javascript\s*\:|#)/)) ? true : false;
  }
  /**
   * 分享功能
   *  data-text data-url data-title data-img data-shareto
   */
  utils.bind(utils.query('body'),'click','.sns-share a',function(){
    var node_data = utils.parents(this,'.sns-share'),
        url = node_data.getAttribute('data-url') || location.href,
        text = encodeURIComponent(node_data.getAttribute('data-text')) || document.title,
        title = encodeURIComponent(node_data.getAttribute('data-title')),
        img = node_data.getAttribute('data-img'),
        shareto = this.getAttribute('data-shareto');

    img = img ? imageHosting(img) : '';
    var share_url={
      weibo: 'http://service.weibo.com/share/share.php?title='+text+'+&url='+url+'&source=bookmark&appkey=2861592023&searchPic=false&pic='+img,
      qzone: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary='+text+'&url='+url+'&title='+ title+'&pics='+img+'&desc='+text
    };
    share_url[shareto] && window.open(share_url[shareto]);
    return false;
  });
  //全局控制 a 链接的打开方式
  utils.bind(utils.query('body'),'click','a',function(e){
    var url = this.getAttribute('href');
    //为JS脚本准备的链接
    if(hrefForScript(url)){
      //阻止浏览器默认事件，处理因base设置，导致此类链接在火狐中新窗口打开问题，感谢 @紫心蕊
      e.preventDefault();
    }else if(lofox.isInRouter(url)){
      //路由中配置的地址
      setTimeout(function () {
        lofox.push(url);
        lofox.refresh();
      });
      e.preventDefault();
    }
  // html base 已设置链接为新窗口打开，此处无需处理
  //  else{
  //  }
  });
});


try {
  console.log("一个人到底多无聊\r\n 才会把 console 当成玩具\r\n一个人究竟多堕落\r\n 才会把大好青春荒废在博客上\r\n\r\n\r\n%cfollow me %c https://github.com/bh-lay","color:red","color:green");
} catch (e) {}
