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
 * @param (timestamp,'{y}-{m}-{d} {h}:{m}:{s}')
 * 
 * y:year
 * m:months
 * d:date
 * h:hour
 * i:minutes
 * s:second
 * a:day
 */
exports.time = function(timestamp,format){
	if(arguments.length==0){
		return null;
	}
	var date = new Date(parseInt(timestamp));
	var format = format ||'{y}-{m}-{d} {h}:{m}:{s}';
	
	var formatObj = {
		y : date.getYear()+1900,
		m : date.getMonth()+1,
		d : date.getDate(),
		h : date.getHours(),
		i : date.getMinutes(),
		s : date.getSeconds(),
		a : date.getDay(),
	};
	
	format = format.replace(/{(y|m|d|h|i|s|a)}/g,function(){
		return formatObj[arguments[0]]||arguments[0];
	});
	return format;
}

exports.createID = function(){
	var date = new Date();
	var id = date.getTime().toString(16);
	return id;
}