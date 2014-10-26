
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
	'<p>哇，你的浏览器真高级！</p>',
	'<p>快试试</p>',
	'<h3>高逼格模式</h3>',
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
		'width': 450,
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
	var $btn = $('.toNewVersion');
	//检测浏览器
	if(!isAdvancedBrowser()){
		$btn.remove();
	}else{
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