
/**
 * 检测是否为高级浏览器
 *
 */
function isAdvancedBrowser(){
	var browser = navigator.appName 
	var b_version = navigator.appVersion 
	var version = b_version.split(";"); 
	var trim_Version = version[1] ? version[1].replace(/[ ]/g,"") : ''; 
	var isIe678 = false;
	if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0"){
		isIe678 = true;
	} else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0"){
		isIe678 = true;
	}else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0"){
		isIe678 = true;
	}
	
	if(isIe678){
		return false;
	}else{
		return true;
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
var changeVersionTpl = ['<div class="newVersionPop">',
	'<div class="nVP_bj"><img src="http://layasset.qiniudn.com/images/version_switch.jpg" /></div>',
	'<div class="nVP_txt">',
		'<p class="nVP_1">你竟然还在使用<span>屌丝版</span></p>',
		'<p class="nVP_2">小剧已为高级浏览器单独做了开发</p>',
		'<p class="nVP_3"><a href="javascript:void(0)">使用尝鲜版</a></p>',
		'<p class=nVP_4><a href="javascript:void(0)">搞什么鬼，还分版本？</a></p>',
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
		var $btn = $('<a href="javascript:void(0)" class="toNewVersion"><i class="glyphicon glyphicon-send"></i>尝鲜版</a>');
		$btn.css('left','-200px');
		$('body').append($btn);
		$btn.animate({
			'left':0
		},200);
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
	$('.nav_comment_link').click(function(){
		UI.confirm({
			'text' : '仅在“尝鲜版”下可用',
			'from' : $(this)[0],
			'mask' : false,
			'btns' : ['进入尝鲜版','保持现状'],
			'callback' : function(){
				jumpToNewVersion();
			}
		});
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