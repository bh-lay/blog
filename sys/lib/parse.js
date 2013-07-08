/*
 * @author bh-lay
 */

exports.cookie = function parseCookie(str){
	var str = str ||'';
	var cookieData = {};
	
	var list = str.split(';');
	
	for(var i = 0 , total = list.length ; i < total ; i++){
		var parseList = list[i].split('=');
		var nameStr = parseList[0]||'';
		var name = nameStr.replace(/^\s+|\s+$/g,'');
		var value = parseList[1]||'';
		
		cookieData[name] = value;
	}
	return cookieData;
}

/**
 * @param (timestamp,'y-M-d h:m:s')
 * 
 * y:2012
 * M:2
 * d:12
 * h:4
 * m:32
 * s:46	
 */
exports.time = function(timestamp,format){
	if(arguments.length==0){
		return null;
	}
	var date = new Date(parseInt(timestamp));
	var format = format ||'y-M-d h:m:s';
	
	var formatObj = {
		y : date.getYear()+1900,
		M : date.getMonth()+1,
		d : date.getDate(),
		h : date.getHours(),
		m : date.getMinutes(),
		s : date.getSeconds()
	};
	
	format = format.replace(/y|M|d|h|m|s/g,function(){
		return formatObj[arguments[0]]||arguments[0];
	});
	return format;
}
