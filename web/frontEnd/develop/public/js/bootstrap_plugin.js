

jQuery(function($){$(document).ready(function(){var contentButton = [];var contentTop = [];var content = [];var lastScrollTop = 0;var scrollDir = '';var itemClass = '';var itemHover = '';var menuSize = null;var stickyHeight = 0;var stickyMarginB = 0;var currentMarginT = 0;var topMargin = 0;$(window).scroll(function(event){var st = $(this).scrollTop();if (st > lastScrollTop){scrollDir = 'down';} else {scrollDir = 'up';}lastScrollTop = st;});$.fn.stickUp = function( options ) {$(this).addClass('stuckMenu');var objn = 0;if(options != null) {for(var o in options.parts) {if (options.parts.hasOwnProperty(o)){content[objn] = options.parts[objn];objn++;}}if(objn == 0) {console.log('error:needs arguments');}itemClass = options.itemClass;itemHover = options.itemHover;if(options.topMargin != null) {if(options.topMargin == 'auto') {topMargin = parseInt($('.stuckMenu').css('margin-top'));} else {if(isNaN(options.topMargin) && options.topMargin.search("px") > 0){topMargin = parseInt(options.topMargin.replace("px",""));} else if(!isNaN(parseInt(options.topMargin))) {topMargin = parseInt(options.topMargin);} else {console.log("incorrect argument, ignored.");topMargin = 0;}	}} else {topMargin = 0;}menuSize = $('.'+itemClass).size();}stickyHeight = parseInt($(this).height());stickyMarginB = parseInt($(this).css('margin-bottom'));currentMarginT = parseInt($(this).next().closest('div').css('margin-top'));vartop = parseInt($(this).offset().top);};$(document).on('scroll', function() {varscroll = parseInt($(document).scrollTop());if(menuSize != null){for(var i=0;i < menuSize;i++){contentTop[i] = $('#'+content[i]+'').offset().top;function bottomView(i) {contentView = $('#'+content[i]+'').height()*.4;testView = contentTop[i] - contentView;if(varscroll > testView){$('.'+itemClass).removeClass(itemHover);$('.'+itemClass+':eq('+i+')').addClass(itemHover);} else if(varscroll < 50){$('.'+itemClass).removeClass(itemHover);$('.'+itemClass+':eq(0)').addClass(itemHover);}}if(scrollDir == 'down' && varscroll > contentTop[i]-50 && varscroll < contentTop[i]+50) {$('.'+itemClass).removeClass(itemHover);$('.'+itemClass+':eq('+i+')').addClass(itemHover);}if(scrollDir == 'up') {bottomView(i);}}}if(vartop < varscroll + topMargin){$('.stuckMenu').addClass('isStuck');$('.stuckMenu').next().closest('div').css({'margin-top': stickyHeight + stickyMarginB + currentMarginT + 'px'}, 10);$('.stuckMenu').css("position","fixed");$('.isStuck').css({top: '0px'}, 10, function(){});};if(varscroll + topMargin < vartop){$('.stuckMenu').removeClass('isStuck');$('.stuckMenu').next().closest('div').css({'margin-top': currentMarginT + 'px'}, 10);$('.stuckMenu').css("position","relative");};});});});

/**
 * 判断是否支持css属性
 * 兼容css3
 */
var supports = (function() {
	var styles = document.createElement('div').style,
		vendors = 'Webkit Khtml Ms O Moz'.split(/\s/);
	
	return function(prop) {
		var returns = false;
		if ( prop in styles ){
			returns = prop;
		}else{
			prop = prop.replace(/^[a-z]/, function(val) {
				return val.toUpperCase();
			});
			for(var i=0,total=vendors.length;i<total;i++){
				if ( vendors[i] + prop in styles ) {
					returns = ('-' + vendors[i] + '-' + prop).toLowerCase();
				}
			}
		}
		return returns;
	};
})();
/**
 * 是否支持 canvas
 */
function supports_canvas() {
  return !!document.createElement('canvas').getContext;
}
/**
 * 检测是否为高级浏览器
 *
 */
function isAdvancedBrowser(){
	if(supports('transition') && supports('transform') && supports_canvas()){
		return true;
	}else{
		return false;
	}
}
/**
 * 今天是否已经显示过弹框
 */
function isShowedToday(){
	var cookie_str = document.cookie || '';
	var time_match = cookie_str.match(/last_show_version_time=(.+?)(;|$)/);
	if(!time_match){
		return false;
	}else{
		var DATE = new Date();
		var month = DATE.getMonth() + 1;
		var date = DATE.getDate();
		if(time_match[1] == month + '-' + date){
			return true;
		}else{
			return false;
		}
	} 
}

/**
 * 进入尝鲜版
 */
function jumpToNewVersion(){
	document.cookie='ui_version=js;path=/';
	window.location.reload();
}
var tips_tpl = ['<div class="newVersionTips">',
	'<div>',
		'<button type="button" class="btn btn-success"><i class="glyphicon glyphicon-send"></i> 尝鲜版</button>',
	'</div>',
'</div>'].join('');
var changeVersionTpl = ['<div class="newVersionPop">',
	'<div class="nVP_bj"><img src="http://layasset.qiniudn.com/images/version_switch.jpg" /></div>',
	'<div class="nVP_txt">',
		'<p class="nVP_1">你竟然还在使用<span>屌丝版</span></p>',
		'<p class="nVP_2">小剧已为高级浏览器单独做了开发</p>',
		'<p class="nVP_3"><a href="javascript:void(0)">使用尝鲜版</a></p>',
		'<p class=nVP_4><a target="_blank" href="/blog/14955f2a02b">搞什么鬼，还分版本？</a></p>',
	'</div>',
'</div>'].join('');
/**
 * 显示版本提示框
 *
 */
var active_pop = null;
function showTips(btn){
	if(active_pop){
		active_pop.close();
		return;
	}
	active_pop = UI.pop({
		'html': changeVersionTpl,
		'from': btn,
		'width': $('body').width() > 720 ? 700 : 300,
		'height' : 430,
		'closeFn' : function(){
			active_pop = null;
			var DATE = new Date();
			var month = DATE.getMonth() + 1;
			var date = DATE.getDate();
			document.cookie = 'last_show_version_time=' + month + '-' + date + ';path=/;';
		}
	});
	$(active_pop.dom).on('click','.nVP_3 a',function(){
		jumpToNewVersion();
	});
}
function version_init(){
	//检测浏览器
	if(isAdvancedBrowser()){
		var $tips = $(tips_tpl);
		var $btn = $tips.find('button');
		$('.navbar').before($tips);
		$btn.click(function(){
			showTips($btn[0]);
		});
		//检测是否已经显示过
		if(!isShowedToday()){
			setTimeout(function(){
				showTips($btn[0]);
			},1000);
		}
	}
}
$.getScript(app_config.frontEnd_base + 'UI/dialog.js',function(){
	version_init();
	
	jQuery(function($) {
		$(document).ready( function() {
			$('.navbar').stickUp({
				itemHover: 'active',
				topMargin: 'auto'
			});
		});
	});
	$('.nav_comment_link').click(function(){
		if(isAdvancedBrowser()){
			UI.confirm({
				'text' : '仅在“尝鲜版”下可用',
				'from' : $(this)[0],
				'mask' : false,
				'btns' : ['进入尝鲜版','保持现状'],
				'callback' : function(){
					jumpToNewVersion();
				}
			});
		}else{
			UI.confirm({
				'text' : '浏览器太老旧，请升级！'
			});
		}
		return false;
	});
});


//评论模块
var $comments = $('.comments_area');
if($comments.length){
	var html;
	if(isAdvancedBrowser()){
		html = ['<div class="panel panel-default">',
			'<div class="panel-heading">评论</div>',
			'<div class="panel-body">',
				'<h3>评论功能，仅在“尝鲜版”下可用！</h3><a href="javascript:void(0)" type="button" class="btn btn-info">进入尝鲜版</a>',
			'</div>',
		'</div>'].join('');
	}
	$comments.html(html);
	
	$comments.on('click','.btn',function(){
		jumpToNewVersion();
	});
	
}