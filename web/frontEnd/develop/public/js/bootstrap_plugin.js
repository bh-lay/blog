
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
	var time_match = cookie_str.match(/last_show_version_time=(.+?);/);
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
var changeVersionTpl = ['<div style="text-align:center;padding: 20px 10px;">',
	'<p>快试试</p>',
	'<h3>尝鲜版</h3>',
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
		'width': 600,
		'closeFn' : function(){
			active_pop = null;
			var DATE = new Date();
			var month = DATE.getMonth() + 1;
			var date = DATE.getDate();
			document.cookie = 'last_show_version_time=' + month + '-' + date + ';path=/;';
		},
		'confirm' : {
			'btns' : ['大胆尝试','胆小不用'],
			'callback' : function(){
				document.cookie='ui_version=js;path=/';
				window.location.reload();
				return false;
			}
		}
	});
}
function version_init(){
	
	
	//检测浏览器
	if(isAdvancedBrowser()){
		var $btn = $('<a href="javascript:void(0)" class="toNewVersion"><i class="glyphicon glyphicon-send"></i>尝鲜版</a>');
		$('body').append($btn);
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
});


//评论模块
var $comments = $('.comments_area');
if($comments.length){
	var html;
	if(isAdvancedBrowser()){
		html = ['<div class="panel panel-default">',
			'<div class="panel-heading">评论</div>',
			'<div class="panel-body">',
				'<h3>评论，请移步尝鲜版！</h3><a href="javascript:void(0)" type="button" class="btn btn-info">进入尝鲜版</a>',
			'</div>',
		'</div>'].join('');
	}
	$comments.html(html);
}