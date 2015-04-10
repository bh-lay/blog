/**
 * @author bh-lay
 * util.events;
 *
 * var evevts = new util.events();
 * events.on('ready',function(){
 * 	//do something
 * });
 * events.emit('ready',args[0],args[1],args[2]);
 * 
 * or
 * //For your own object extend event
 * util.events.extend(this);
 * 
 */

window.util = window.util || {};

(function(exports){
	function ON(eventName,callback){
		//事件堆无该事件，创建一个事件堆
		if(!this.events[eventName]){
			this.events[eventName] = [];
		}
		this.events[eventName].push(callback);
	}
	function EMIT(eventName,args){
		//事件堆无该事件，结束运行
		if(!this.events[eventName]){
			return
		}
		for(var i=0,total=this.events[eventName].length;i<total;i++){
			this.events[eventName][i].call(this.event_global || this,args);
		}
	}
	//继承
	function EXTEND(){
		this.events = {};
		this.on = ON;
		this.emit = EMIT;
	}
	function EVENTS(global){
		this.events = {};
		this.event_global = global || null;
		//console.log(this);
	}
	EVENTS.prototype = {
		'on' : ON,
		'emit' : EMIT
	};
	
	exports.events = EVENTS;
	exports.events.extend = EXTEND;
})(window.util);

//提供commonJS规范的接口
window.define && define(function(require,exports){

	exports.events = window.util.events;
	exports.extend = window.util.events.extend;
});