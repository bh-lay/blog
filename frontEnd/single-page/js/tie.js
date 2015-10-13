/**
 * @author bh-lay
 * @github https://github.com/bh-lay/tie.js
 * @modified 2015-10-13 18:57
 *  location fox
 * 处理既要相对于某个模块固定，又要在其可视时悬浮的页面元素
 * util.tie({
		dom: ,			//需要浮动的元素
		scopeDom: ,		//页面显示时的参照元素
		fixed_top: 20	//悬浮时，距顶部的距离
	});
 * 
 */


(function(global,factory_fn){
	global.util = global.util || {};
	global.util.tie = factory_fn(global);
	
	global.define && define(function(){
		return global.util.tie;
	});
})(window,function(window){
	var isIE67 = false,
		private_$doc = $(document);
	if(navigator.appName == "Microsoft Internet Explorer"){
		var version = navigator.appVersion.split(";")[1].replace(/[ ]/g,"");
		if(version == "MSIE6.0" || version == "MSIE7.0"){
			isIE67 = true; 
		}
	}
	
	var fix_position = isIE67 ? function(scrollTop){
		var top;
		if(this.state == 'min'){
			top = 0; 
		}else if(this.state == 'max'){
			top = this.maxScrollTop - this.minScrollTop;
		}else if(this.state == 'mid'){
			top = scrollTop - this.minScrollTop;
		}
		this.dom.animate({
			top: top
		},100).css({
			position: 'absolute'
		});
	} : function(scrollTop){
		var top,position;
		if(this.state == 'min'){
			top = 0;
			position =  this._position_first;
		}else if(this.state == 'max'){
			top = this.maxScrollTop - this.minScrollTop;
			position = 'absolute';
		}else{
			top = this.fix_top;
			position = 'fixed';
		}
		this.dom.css({
			top: top,
			position: position
		});
	};

	function INIT(param){
		if( !(this instanceof INIT)){
			return new INIT(param);
		}
		var me = this,
			scroll_delay;
		param = param || {};
		//悬浮dom
		me.dom = param.dom;
		me.$scrollDom = param.scrollDom || $(window);
		//从属dom
		me.scopeDom = param.scopeDom;
		//悬浮时，距顶部的距离
		me.fix_top = param.fixed_top || 0;
		me.minScrollTop = null;
		me.maxScrollTop = null;
		//当定位方式发生变化时
		me.onPositionChange = param.onPositionChange || null;
		//原本的position属性
		me._position_first = me.dom.css('position');
		
		me.state = 'min';
		me._scroll_listener = function(){
			me.refresh();
		}
		
		me.refresh();
		
		if(me.scopeDom.css('position') == 'static'){
			me.scopeDom.css('position','relative');
		}
		me.$scrollDom.on('scroll',me._scroll_listener);
	}
	INIT.prototype = {
		refresh: function (){
			var domH = this.dom.height(),
				cntH = this.scopeDom.outerHeight();
			this.minScrollTop = this.scopeDom.offset().top - this.fix_top;
			this.maxScrollTop = this.minScrollTop + cntH - domH;

			var scrollTop = private_$doc.scrollTop(),
				state_before = this.state;
			if(scrollTop <= this.minScrollTop){
				this.state = 'min';
			}else{
				this.state = scrollTop >= this.maxScrollTop ? 'max' : 'mid';
			}
			fix_position.call(this,scrollTop);
			if(state_before != this.state){
				this.onPositionChange && this.onPositionChange.call(this,this.state);
			}
		},
		destroy: function(){
			this.$scrollDom.unbind('scroll',this._scroll_listener);
			
			this.dom.css({
				position: 'absolute',
				top: Math.max(private_$doc.scrollTop() - this.minScrollTop,0)
			});
		}
	};
	return INIT;
});