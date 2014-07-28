/**
 * @author bh-lay
 * @github https://github.com/bh-lay/tie.js
 * @modified 2014-7-25 0:37
 *  location fox
 * 处理既要相对于某个模块固定，又要在其可视时悬浮的页面元素
 * util.tie({
		'dom' : ,			//需要浮动的元素
		'scopeDom' : ,		//页面显示时的参照元素
		'fixed_top' : 20	//悬浮时，距顶部的距离
	});
 * 
 */

window.util = window.util || {};

(function(exports){
	var isIE67 = false;
	if(navigator.appName == "Microsoft Internet Explorer"){
		var version = navigator.appVersion.split(";")[1].replace(/[ ]/g,"");
		if(version == "MSIE6.0" || version == "MSIE7.0"){
			isIE67 = true; 
		}
	}
	
	var fix_position = (function (){
		if(isIE67){
			return function(scrollTop){
				var top;
				if(this.state == 'min'){
					top = 0; 
				}else if(this.state == 'max'){
					top = this.maxScrollTop - this.minScrollTop;
				}else if(this.state == 'mid'){
					top = scrollTop - this.minScrollTop;
				}
				alert(this.state + top);
				this.dom.animate({
					'top' : top
				},100).css({
					'position' : 'absolute'
				});
			};
		}else{
			return function(scrollTop){
				if(this.state == 'min'){
					this.dom.css({
						'top' : 0,
						'position' : this._position_first
					});
				}else if(this.state == 'max'){
					this.dom.css({
						'top' : this.maxScrollTop - this.minScrollTop,
						'position' : 'absolute'
					});
				}else{
					this.dom.css({
						'top' : this.fix_top,
						'position' : 'fixed'
					});
				}
			};
		}
	})();

	function INIT(param){
		var this_slide = this;
		var param = param || {};
		this.dom = param['dom'];
		//从属dom
		this.scopeDom = param['scopeDom'];
		//原本的position属性
		this._position_first = this.dom.css('position');
		//悬浮时，距顶部的距离
		this.fix_top = param['fixed_top'] || 0;
		this.height = null;
		this.cntH = null;
		this.minScrollTop = null;
		this.maxScrollTop = null;
		this.state = 'min';
		
		var scrollDom = param['scrollDom'] || $(window);
		
		this.refresh();
		
		if(this.scopeDom.css('position') == 'static'){
			this.scopeDom.css('position','relative');
		}
	//	var delay;
		scrollDom.on('scroll',function(){
		//	console.log('滚着呢--')
	//		clearTimeout(delay);
	//		delay = setTimeout(function(){
		//		console.log('滚完了--->>>>>>>>')
		//		console.log(' ')
				this_slide.refresh();
	//		},10);
		});
	}
	var doc = $(document);
	INIT.prototype.refresh = function (){
		this.height = this.dom.height();
		this.cntH = this.scopeDom.outerHeight();
		this.minScrollTop = this.scopeDom.offset().top - this.fix_top;
		this.maxScrollTop = this.minScrollTop + this.cntH - this.height;
	//	this.dom.parent().height(this.height);
		var scrollTop = doc.scrollTop();
		if(scrollTop < this.minScrollTop){
			this.state = 'min';
		}else if(scrollTop > this.maxScrollTop){
			this.state = 'max';
		}else{
			this.state = 'mid';
		}
		//console.log(this.state,scrollTop ,this.minScrollTop);
		fix_position.call(this,scrollTop);
	};
	exports.tie = function(param){
		return new INIT(param);
	};
})(window.util);

window.define && function(require,exports,module){
	return window.util.tie;
};