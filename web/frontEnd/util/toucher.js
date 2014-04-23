/**
 * @author 剧中人
 * @github https://github.com/bh-lay/toucher
 * @modified 2014-4-16 21:35
 * 
 */
window.util = window.util || {};

window.util.toucher = window.util.toucher || function (dom){
	return new window.util.toucher.init(dom);
};

(function(exports){
	//处理自定义事件
	function ON(eventName,callback){
		this._events = this._events || {};
		//事件堆无该事件，创建一个事件堆
		if(!this._events[eventName]){
			this._events[eventName] = [];
		}
		this._events[eventName].push(callback);
		//提供链式调用的支持
		return this;
	}
	function EMIT(eventName,args){
		this._events = this._events || {};
		//事件堆无该事件，结束运行
		if(!this._events[eventName]){
			return
		}
		for(var i=0,total=this._events[eventName].length;i<total;i++){
			this._events[eventName][i].call(this.event_global || this,args);
		}
	}
	
	function swipeDirection(x1, x2, y1, y2) {
		return Math.abs(x1 - x2) >=
			Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
	}
	
	function touch(dom){
		var this_touch = this;
		var DOM = dom;
		//轻击开始时间
		var touchStartTime = 0;
		//记录上一次点击时间
		var lastTouchTime = 0;
		//记录初始轻击的位置
		var x1,y1,x2,y2;
		//轻击事件的延时器
		var touchDelay;
		//测试长按事件的延时器
		var longTap;
		//记录当前事件是否已为等待结束的状态
		var isActive = false;
		
		//单次用户操作结束
		function actionOver(){
			isActive = false;
			clearTimeout(longTap);
			clearTimeout(touchDelay);
		}
		
		function touchStart(e){
			x1 = e.touches[0].pageX;
			y1 = e.touches[0].pageY;
			x2 = 0;
			y2 = 0;
			isActive = true;
			touchStartTime = new Date();
			
			//检测是否为长按
			clearTimeout(longTap);
			longTap = setTimeout(function(){
				actionOver();
				//断定此次事件为长按事件
				this_touch.emit('longTap');
			},500);
	//		$('.console').html('<br/>____________<br/>');
		}
		function touchend(){
			if(!isActive){
				return
			}
			var now = new Date();
			if(now - lastTouchTime > 260){
				touchDelay = setTimeout(function(){
					//断定此次事件为轻击事件
					actionOver();
					this_touch.emit('singleTap');
				},250);
			}else{
				clearTimeout(touchDelay);
				actionOver();
				//断定此次事件为连续两次轻击事件
				this_touch.emit('doubleTap');
			}
			lastTouchTime = now;
		}
		
		function touchmove(e){
			//断定此次事件为移动事件
			this_touch.emit('swipe');
			
			if(!isActive){
				return
			}
    	    x2 = e.touches[0].pageX
        	y2 = e.touches[0].pageY
			if(Math.abs(x1-x2)>2 || Math.abs(y1-y2)>2){
				//断定此次事件为移动手势
				var direction = swipeDirection(x1, x2, y1, y2);
				this_touch.emit('swipe' + direction);
			}else{
				//断定此次事件为轻击事件
				actionOver();
				this_touch.emit('singleTap');

			}
			actionOver();
			e.preventDefault();
			e.stopPropagation();
		}
		
		/**
		 * 对开始手势的监听
		 */
		DOM.addEventListener('touchstart',touchStart);
		DOM.addEventListener('MSPointerDown',touchStart);
		DOM.addEventListener('pointerdown',touchStart);
		
		/**
		 * 对手势结束的监听（轻击）
		 */
		DOM.addEventListener('touchend',touchend);
		DOM.addEventListener('MSPointerUp',touchend);
		DOM.addEventListener('pointerup',touchend);
		
		/**
		 * 对移动手势的监听
		 */
		DOM.addEventListener('touchmove',touchmove);
		DOM.addEventListener('MSPointerMove',touchmove);
		DOM.addEventListener('pointermove',touchmove);
		
		/**
		 * 对移动结束的监听
		 */
		DOM.addEventListener('touchcancel',actionOver);
		DOM.addEventListener('MSPointerCancel',actionOver);
		DOM.addEventListener('pointercancel',actionOver);
	}
	touch.prototype['on'] = ON;
	touch.prototype['emit'] = EMIT;
	exports.init = touch;
})(util.toucher);

//提供CommonJS规范的接口
window.define && define(function(require,exports,module){
	//对外接口
	return window.util.toucher;
});