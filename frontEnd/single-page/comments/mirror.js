/**
 * @author bh-lay
 * 
 * 镜像复制文本框功能
 * 用于计算光标在输入框中的绝对位置及文本的真实高度
 * 依赖 Jquery
 * 
 */

(function(global,doc,factoryFn){
	global.util = global.util || {};
	global.util.mirror = global.util.mirror || factoryFn(global,doc);
	
	global.define && define(function(){
		return global.util.mirror;
	});
})(window,document,function(window,document){
	var cssAttr = [
		//"height",
		//"width",
		"paddingTop","paddingLeft","paddingRight","paddingBottom",
		"marginTop", "marginLeft", "marginRight", "marginBottom",
		"-webkit-box-sizing","-moz-box-sizing","-ms-box-sizing","-o-box-sizing","box-sizing",
		"fontFamily","fontSize","text-align",
		"wordWrap","lineHeight",
		"borderStyle","borderWidth",
		"overflowX","overflowY"
	];
	/**
	 *  设置位置
	 *  镜像domA,源domB
	 */
	function setPosition(domA,domB){
		var offset = domB.offset();
		var scrollTop = domB.scrollTop();
		var scrollLeft = domB.scrollLeft();
		domA.css({
		  	'position' : 'absolute',
		  	'width' : domB.width(),
		 	'top' : offset.top,
		 	'left' : offset.left,
		 	'marginTop' : -scrollTop,
		 	'marginLeft' : -scrollLeft
		 });
	}
	function copyBaseCSS(domA,domB){
		var cssObj = {
		 	'white-space' : 'pre-wrap'
		};
		for(var i=0,total=cssAttr.length;i<total;i++){
			var prop = cssAttr[i];
			cssObj[prop] = domB.css(prop);
		}
		domA.css(cssObj);
	}
	//过滤字符
	function filterTxt(txt){
		var newTxt = txt.replace(/</g, '&lt')
			.replace(/>/g, '&gt')
			.replace(/`/g, '&#96')
			.replace(/"/g, '&quot')
			.replace(/\r\n|\r|\n/g, "<br/>");
		return newTxt;
	}
	
	
	function MIRROR(origin){
	
		this.dom = $('<div></div>');
		this.origin = origin;
		this.state = {};
		copyBaseCSS(this.dom,this.origin);
		setPosition(this.dom,this.origin);
	}
	MIRROR.prototype = {
		'refresh' : function(){
			
			var startPoint = this.origin.Selection()[0];
			var txt = this.origin.val();
			var frontTxt = txt.slice(0,startPoint);
			var endTxt = txt.slice(startPoint);
		
			frontTxt = filterTxt(frontTxt);
			endTxt = filterTxt(endTxt);
			
			var mirrorTxt = frontTxt + '<span></span>' + endTxt + '-';
		
			this.dom.html(mirrorTxt);
			//校正位置
			setPosition(this.dom,this.origin);
			
			$('body').append(this.dom);
			
			var offset = this.dom.find('span').offset();
			var state = {
				'realHeight' : this.dom[0].scrollHeight,
				'cursor' : {
					'top' : offset.top - this.origin.scrollTop(),
					'left' : offset.left
				}
			};
			this.state = state;
			this.dom.remove();
			this.origin.focus();
			return state;
		}
	};
	return function(textarea){
		return new MIRROR(textarea);
	};
});