
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
/**
 * 显示版本提示框
 *
 */
function showTips(){
	var $btn = $('.toNewVersion');
	//检测浏览器
	if(!isAdvancedBrowser()){
		$btn.hide();
		return;
	}
	//检测是否已经显示过
	if(isShowedToday()){
		return;
	}
	UI.pop({
		'html': 'gun',
		'from': $btn[0],
		'mask': true,
		'closeFn' : function(){
			//alert('123467');
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

$.getScript(app_config.frontEnd_base + 'UI/dialog.js',function(){
	setTimeout(function(){
		showTips();
	},1000);
});