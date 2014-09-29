

(function(global,factoryFn){
	var factory = factoryFn();
	
	global.util = global.util || {};
	global.util.events = factory.events.;
	global.util.events.extend = factory.extend;
})(window,function(exports){

	/**
	 * 绑定自定义事件
	 *	eventName 事件名
	 *	callback 回调
	 */
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
	/**
	 * 触发自定义事件
	 *	eventName 事件名
	 *	args 参数（数组）
	 */
	function EMIT(eventName,args){
		this._events = this._events || {};
		var eventArray = this._events[eventName];
		//事件堆无该事件，结束运行
		if(!eventArray){
			return
		}
		for(var i=0,total=eventArray.length;i<total;i++){
			eventArray[i].apply(this.event_global || this,args);
		}
	}
	/**
	 * 解除事件绑定
	 *	eventName 事件名
	 *	callback 回调（非必要）
	 */
	function UNBIND(eventName,callback){
		this._events = this._events || {};
		var eventArray = this._events[eventName] || [];
		if(!eventArray.length){
			return
		}
		if(callback){
			//逆序匹配回调函数
			for(var i = eventArray.length-1;i!=-1;i--){
			  if(eventArray[i] == callback){
				eventArray.splice(i,1);
				}
			}
		}else{
			//置空回调
			this._events[eventName] = [];
		}
	}
	
	//继承方法
	function EXTEND(){
		this._events = {};
		this.on = ON;
		this.emit = EMIT;
		this.unbind = UNBIND;
	}
	//事件对象类
	function EVENTS(global){
		this._events = {};
		this.event_global = global || null;
	}
	EVENTS.prototype = {
		'on' : ON,
		'emit' : EMIT,
		'unbind' : UNBIND
	};
	
	return {
		'events' : EVENTS,
		'extend' : EXTEND
	};
});