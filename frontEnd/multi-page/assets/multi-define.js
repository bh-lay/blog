import "./bootstrap/css/bootstrap.css";
import "./bootstrap_plugin.less";
import "./font.css";

/**
 * 今天是否已经显示过弹框
 */
function isShowedToday() {
  var time_match = localStorage.getItem('last_show_version_time');
  if (!time_match) {
    return false;
  } else {
    var DATE = new Date();
    var month = DATE.getMonth() + 1;
    var date = DATE.getDate();
    if (time_match == month + '-' + date) {
      return true;
    } else {
      return false;
    }
  }
}

var tips_tpl = ['<div class="newVersionTips">',
  '<div class="container">',
  '<h1>正在使用<span>屌丝版</span></h1>',
  '<button type="button" class="btn btn-success btn-sm toNewVersion"><i class="glyphicon glyphicon-send"></i> 进入尝鲜版</button>',
  '</div>',
  '</div>'].join('');
var changeVersionTpl = ['<div class="newVersionPop">',
  '<div class="nVP_bj"><img src="http://static.bh-lay.com/images/version_switch.jpg" /></div>',
  '<div class="nVP_txt">',
  '<p class="nVP_1"></p>',
  '<p class="nVP_1">你竟然还在使用<span>屌丝版</span></p>',
  '<p class="nVP_2">小剧已为高级浏览器单独做了开发</p>',
  '<p class="nVP_3"><a href="javascript:void(0)" class="toNewVersion">使用尝鲜版</a></p>',
  '<p class=nVP_4><a target="_blank" href="/blog/14955f2a02b">搞什么鬼，还分版本？</a></p>',
  '</div>',
  '<a href="javascript:void(0)" class="nVP_close">×</a>',
  '</div>'].join('');

/**
 * 显示版本提示框
 *
 */
function version_init() {
  //检测浏览器
  if (blog.isAdvancedBrowser) {
    var $tips = $(tips_tpl);
    $('body').append($tips);
    //检测是否已经显示过
    if (!isShowedToday()) {
      $tips.find('.container').hide();
      var $pop = $(changeVersionTpl);
      $tips.prepend($pop);
      $pop.on('click', '.nVP_close', function () {
        $pop.slideUp(200);
        $tips.find('.container').slideDown(200);
      });

      var DATE = new Date();
      var month = DATE.getMonth() + 1;
      var date = DATE.getDate();
      localStorage.setItem('last_show_version_time', month + '-' + date);
    }
  }
}

version_init();
$('body').on('click', '.toNewVersion', function () {
  blog.jumpToNewVersion();
});
$('.nav_comment_link').click(function () {
  if (blog.isAdvancedBrowser) {
    UI.confirm({
      'text': '仅在“尝鲜版”下可用',
      'from': $(this)[0],
      'mask': false,
      'btns': ['进入尝鲜版', '保持现状'],
      'callback': function () {
        blog.jumpToNewVersion();
      }
    });
  } else {
    UI.confirm({
      'text': '浏览器太老旧，请升级！'
    });
  }
  return false;
});

//评论模块
var $comments = $('.comments_area');
if ($comments.length) {
  var html;
  if (blog.isAdvancedBrowser) {
    html = ['<div class="panel panel-default">',
      '<div class="panel-heading">评论</div>',
      '<div class="panel-body">',
      '<h3>评论功能，仅在“尝鲜版”下可用！</h3><a href="javascript:void(0)" type="button" class="btn btn-info">进入尝鲜版</a>',
      '</div>',
      '</div>'].join('');
  }
  $comments.html(html);

  $comments.on('click', '.btn', function () {
    blog.jumpToNewVersion();
  });
}

//代码高亮
(function () {
  $('pre').each(function () {
    hljs.highlightBlock(this);
  });
})();
