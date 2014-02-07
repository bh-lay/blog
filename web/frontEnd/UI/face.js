/**
 * @author bh-lay
 * 
 * UI.face();
 * UI
 * user Interface 
 * user Interaction
 * 
 * Function depends on
 *		JQUERY
 * 	load
 **/
window.UI = window.UI || {};
(function(exports){	
	var faceData = null;
	var faceData = [
		{src : "1bishi.gif", title : "±ÉÊÓ"},
		{src : "2cahan.gif", title : "²Áº¹"},
		{src : "3daxiao.gif", title : "´óÐ¦"},
		{src : "4deyi.gif", title : "µÃÒâ"},
		{src : "5fanbaiyan.gif", title : "·­°×ÑÛ"},
		{src : "6hengheng.gif", title : "ºßºß"},
		{src : "7huaixiao.gif", title : "»µÐ¦"},
		{src : "8jingkong.gif", title : "¾ª¿Ö"},
		{src : "9kaixin.gif", title : "¿ªÐÄ"},
		{src : "10keai.gif", title : "¿É°®"},
		{src : "11kelian.gif", title : "¿ÉÁ¯"},
		{src : "12ku.gif", title : "¿Þ"},
		{src : "13liuhan.gif", title : "Á÷º¹"},
		{src : "14nanguo.gif", title : "ÄÑ¹ý"},
		{src : "15qinqin.gif", title : "Ç×Ç×"},
		{src : "16semimi.gif", title : "É«ÃÔÃÔ"},
		{src : "17shengqi.gif", title : "ÉúÆø"},
		{src : "18shuijiao.gif", title : "Ë¯¾õ"},
		{src : "19tiaopi.gif", title : "µ÷Æ¤"},
		{src : "20touxiao.gif", title : "ÍµÐ¦"},
		{src : "21wabikong.gif", title : "ÍÚ±Ç¿×"},
		{src : "22weiqu.gif", title : "Î¯Çü"},
		{src : "23yiwen.gif", title : "ÒÉÎÊ"},
		{src : "24yun.gif", title : "ÔÎ"},
		{src : "25zhuakuang.gif", title : "×¥¿ñ"},
		{src : "26ohhehe.gif", title : "Å¶ºÇºÇ"},
		{src : "27aoman.gif", title : "°ÁÂý"},
		{src : "28ganga.gif", title : "ÞÏÞÎ"},
		{src : "29guzhang.gif", title : "¹ÄÕÆ"},
		{src : "30haixiu.gif", title : "º¦Ðß"},
		{src : "31jingya.gif", title : "¾ªÑÈ"},
		{src : "32kulou.gif", title : "÷¼÷Ã"},
		{src : "33qiaoda.gif", title : "ÇÃ´ò"},
		{src : "34qiudale.gif", title : "ôÜ´óÁË"},
		{src : "35zaijian.gif", title : "ÔÙ¼û"},
		{src : "36bianzhu.gif", title : "±äÖí"},
		{src : "37dongji.gif", title : "¶¬¼¾"},
		{src : "38qidao.gif", title : "Æíµ»"},
		{src : "39ohyes.gif", title : "Å¶Ò²"},
		{src : "51okey.gif", title : "ok"},
		{src : "52dabian.gif", title : "´ó±ã"},
		{src : "53damuzhi.gif", title : "´óÄ´Ö¸"},
		{src : "54daohecai.gif", title : "µ¹ºÈ²Ê"},
		{src : "55ding.gif", title : "¶¥"},
		{src : "56wen.gif", title : "ÎÇ"},
		{src : "57meigui.gif", title : "Ãµ¹å"},
		{src : "58paishou.gif", title : "ÅÄÊÖ"},
		{src : "59shuai.gif", title : "Ë¥"},
		{src : "60son.gif", title : "Ì«Ñô"},
		{src : "61xin.gif", title : "ÐÄ"},
		{src : "62xinsui.gif", title : "ÐÄËé"},
		{src : "63ye.gif", title : "Ò®"},
		{src : "64moon.gif", title : "ÔÂÁÁ"},
		{src : "65v5.gif", title : "v5"},
		{src : "66geili.gif", title : "¸øÁ¦"},
		{src : "67jiong.gif", title : "\u56e7"},
		{src : "68zhai.gif", title : "Õ¬"},
		{src : "69diujidan.gif", title : "¶ª¼¦µ°"},
		{src : "70shengdanshu.gif", title : "Ê¥µ®Ê÷"},
		{src : "71shoutao.gif", title : "ÊÖÌ×"},
		{src : "72tongqian.gif", title : "Í­Ç®"},
		{src : "73wazi.gif", title : "Íà×Ó"},
		{src : "74xiandanchaoren.gif", title : "ÏÌµ°³¬ÈË"}
	];
	
	var require = new loader({
		'pop' : '/js/api/UI/pop.js'
	});
	require.load('pop');
	
	var faceTpl = '<a href="javascript:void(0)" title="{title}" style="background-image:url(/weibo/assets/images/face/{src})" ></a>';
	var faceCSS = ['<style type="text/css" data-module="face">',
		'.face_edit_cnt{overflow:hidden;border:1px solid #ddd;background:#fff;}',
		'.face_edit{width:279px;margin:-1px 0px 0px -1px;overflow:hidden;background:#fff;}',
		'.face_edit a{display:block;float:left;width:30px;height:30px;margin:0px;border:1px solid #eee;border-bottom: none;border-right: none;background-position:center center;background-repeat: no-repeat;',
			'transition:0.1s;',
			'-moz-transition-duration: 0.1s;',
			'-webkit-transition-duration: 0.1s;',
			'-o-transition-duration: 0.1s;}',
		'.face_edit a:hover{background-color: #ddd}',
		'.face_edit a:active{background-color: #bbb}',
	'</style>'].join('');
	$(function(){
		$('head').append(faceCSS);
	});
	
//	function getData (callback){
//		$.ajax({
//			'url' : '',
//			'type' : 'GET', 
//			'success' : function(d){
//				var data = eval('(' + d  + ')');
//				callback&&callback(data.list);
//			}
//		});
//	}
	function render(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	function renderFace(dom){
		var html = render(faceTpl,faceData);
		html = '<div class="face_edit">' + html + '</html>';
		dom.html(html);
	}
	function FACE(param){
		var param = param || {};
		var top = param['top'] || 200,
			 left = param['left'] || 200;
		
		var this_face = this;
		this.callback = param['callback'] || null;
		this.closeFn = param['closeFn'] || null;
		this.pop = UI.plane({
			'width' : 280,
			'top' : top,
			'left' : left,
			'html' : '<div class="face_edit_cnt"><div class="pro_loading"></div></div>',
			'closeFn' : function(){
				this_face.closeFn&&this_face.closeFn();
			}
		});
		this.dom = this.pop.dom;
//		if(faceData){
			renderFace(this_face.pop.dom.find('.face_edit_cnt'));
//		}else{
//			getData(function(data){
//				faceData = data;
//				renderFace(this_face.pop.dom.find('.face_edit_cnt'));
//			});
//		}
		
		this.pop.dom.on('click','.face_edit a',function(){
			this_face.close();
			this_face.callback&&this_face.callback($(this).attr('title'));
		});
	}
	FACE.prototype = {
		'close' : function(){
			this.pop.close();
			this.closeFn&&this.closeFn();
		}
	};
	exports.face = function(param){
		return new FACE(param);
	}
})(window.UI);