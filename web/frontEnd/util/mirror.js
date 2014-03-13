/**
 * @author bh-lay
 * 
 * 镜像复制文本框功能
 * 用于计算光标在输入框中的绝对位置及文本的真实高度
 * 依赖 Jquery
 * 
 */

window.util = window.util || {};

(function(exports){
	var cssAttr = [
		//"height",
		//"width",
		"paddingTop","paddingLeft","paddingRight","paddingBottom",
		"marginTop", "marginLeft", "marginRight", "marginBottom",
		"fontFamily","fontSize","text-align",
		"wordWrap","lineHeight",
		"borderStyle","borderWidth",
		"overflowX","overflowY"
	];
	//镜像domA,源domB
	function copyBase(domA,domB){
		var offset = domB.offset();
		domA.scrollTop(domB.scrollTop())
			 .scrollLeft(domB.scrollLeft())
			 .css({
			  	'position' : 'absolute',
			  	'width' : domB.width(),
			  //	'height' : domB.height(),
			 	'top' : offset.top,
			 	'left' : offset.left
			 });
	}
	function copyCSS(domA,domB){
		var cssObj = {
		 	'white-space' : 'pre-wrap'
		};
		for(var i=0,total=cssAttr.length;i<total;i++){
			cssObj[cssAttr[i]] = domB.css(cssAttr[i]);
		}
		domA.css(cssObj);
	}
	//过滤字符
	function filterTxt(txt){
		var newTxt = txt.replace(/</g, '&lt')
			.replace(/>/g, '&gt')
			.replace(/`/g, '&#96')
			.replace(/"/g, '&quot')
			.replace(/\r\n|\r|\n/g, "<br />");
		return newTxt;
	}
	function MIRROR(origin){
		this.dom = $('<div></div>');
		this.origin = origin;
		this.state = {};
		copyCSS(this.dom,this.origin);
		copyBase(this.dom,this.origin);
	}
	MIRROR.prototype = {
		'refresh' : function(){
			var startPoint = this.origin.Selection()[0];
			var txt = this.origin.val();
			var frontTxt = txt.slice(0,startPoint);
			var endTxt = txt.slice(startPoint);
		
			frontTxt = filterTxt(frontTxt);
			endTxt = filterTxt(endTxt);
		
			var mirrorTxt = frontTxt + '<span></span>' + endTxt;
			this.dom.html(mirrorTxt);
			//校正位置
			copyBase(this.dom,this.origin);
			$('body').append(this.dom);
			var offset = this.dom.find('span').offset();
			var state = {
				'realHeight' : this.dom[0].scrollHeight,
				'cursor' : {
					'top' : offset.top - this.origin.scrollTop(),
					'left' : offset.left
				}
			}
			this.state = state;
			this.dom.remove();
			return state;
		}
	};
	exports.mirror = function(textarea){
		return new MIRROR(textarea);
	};
})(window.util);