/**
 * @author bh-lay
 * 
 * 
 *  $(selector).Selection()
 *  
 */

window.util = window.util || {};
(function(exports){
	String.prototype.countL = (function () {
		return function(){
			var s = this;
			var l = 0;
			var a = s.split("");
			for (var i=0;i<a.length;i++) {
				if(a[i].charCodeAt(0)<299) {
					l++;
				} else {
					l+=2;
				}
			}
			return l;
		}
	})();
	//set
	var setPosition = (function() {
		var textarea = document.createElement("textarea");
		if (textarea.setSelectionRange) {//FF
			return function(tarea,start, len) {
				var len = len || 0;
				tarea.focus();
				setTimeout(function(){
					tarea.focus();
					tarea.setSelectionRange(start,start+len);
				});
			}
		} else if (textarea.createTextRange) {//IE
			return function(tarea,start, len) {
				var len = len || 0;
				tarea.focus();
				var strLen = tarea.value.length;
				var rng = tarea.createTextRange();
				rng.moveStart('character', start);
				rng.moveEnd('character', start + len - strLen);
				rng.select();
			}
		}
	})();
	//get
	var getPosition = (function(){
		var textarea = document.createElement("textarea");
		if(!textarea.createTextRange){ //not IE
			return function(tarea){
				return [tarea.selectionStart,tarea.selectionEnd];
			}
		}else{ //IE
			return function(tarea){
				var start = 0,
					 end = 0;
				tarea.focus();
				var sTextRange = document.selection.createRange();
				
				if (tarea.tagName == "TEXTAREA") {
					var oTextRange = document.body.createTextRange();
					oTextRange.moveToElementText(tarea);
					for (start = 0; oTextRange.compareEndPoints("StartToStart", sTextRange) < 0; start++) {
						oTextRange.moveStart('character', 1);
					}
					for (var i = 0; i <= start; i++) {
						if (tarea.value.charAt(i) == '\n') {
							start++;
						}
					}
					oTextRange.moveToElementText(tarea);
					for (end = 0; oTextRange.compareEndPoints('StartToEnd', sTextRange) < 0; end++) {
						oTextRange.moveStart('character', 1);
					}
					for(var i = 0; i <= end; i++) {
						if(tarea.value.charAt(i) == '\n') {
							end++;
						}
					}
				}
				return [start,end];
			}
		}
	})();
	//set & get
	function Selection(){
		var tarea = arguments[0];
		if(tarea.tagName != 'TEXTAREA'){
			return
		}
		if(arguments['length'] > 1){
			setPosition(tarea,arguments[1],arguments[2]);
		}else{
			return getPosition(tarea);
		}
	}
	//insert
	function insertTxt(tarea,txt,start,end){
		if(tarea.tagName != 'TEXTAREA' || typeof(txt) == 'undefined'){
			return
		}
		var txt = txt.toString();
		var this_start,this_end;
		if(typeof(start) == 'undefined'){
			var pos = getPosition(tarea);
			
			this_start = pos[0];
			this_end = pos[1];
		}else{
			this_start = parseInt(start);
			this_end = end || this_start;
		}
		
		var allTxt = tarea.value,
			 frontTxt = allTxt.slice(0,this_start),
			 endTxt = allTxt.slice(this_end);
		tarea.value = frontTxt + txt + endTxt;
		
		tarea.focus();
		setPosition(tarea ,frontTxt.length + txt.length,0);
	};
	
	
	//exports
	exports.insertTxt = insertTxt;
	exports.Selection = Selection;
	
	//exports for jquery
	$ = $ ||{fn:{}};
	$.fn.Selection = function(){
		var tarea = this[0];
		if(tarea.tagName != 'TEXTAREA'){
			return this
		}else if(arguments['length'] > 0){
			setPosition(tarea,arguments[0],arguments[1]);
			return this
		}else{
			return getPosition(tarea);
		}
	};
	$.fn.insertTxt = function(txt,start,end){
		insertTxt(this[0],txt,start,end);
		return this
	};
})(window.util);