/**
 * @author bh-lay
 */
var querystring = require('querystring');
var formidable = require('formidable');


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
 * @param (timestamp/Date,'{y}-{m}-{d} {h}:{m}:{s}')
 * 
 * y:year
 * m:months
 * d:date
 * h:hour
 * i:minutes
 * s:second
 * a:day
 */
exports.time = function(time,format){
	if(arguments.length==0){
		return null;
	}
	var format = format ||'{y}-{m}-{d} {h}:{i}:{s}';
	
	if(typeof(time) == "object"){
		var date = time;
	}else{
		var date = new Date(parseInt(time));
	}
	
	var formatObj = {
		y : date.getYear()+1900,
		m : date.getMonth()+1,
		d : date.getDate(),
		h : date.getHours(),
		i : date.getMinutes(),
		s : date.getSeconds(),
		a : date.getDay(),
	};
	
	var time_str = format.replace(/{(y|m|d|h|i|s|a)}/g,function(){
		console.log(arguments)
		return formatObj[arguments[1]]||arguments[0];
	});
	//console.log(format,formatObj)
	return time_str;
}

//
exports.createID = function(){
	var date = new Date();
	var id = date.getTime().toString(16);
	return id;
}

/**
 * parse request data
 * callBack(err, fields, files);
 */
exports.request = function(req,callBack){
	if(!callBack){
		return 
	}

	var method = req['method']||'';
	
	if(method == 'POST' || method =='post'){
		var form = new formidable.IncomingForm();
		form.uploadDir = "./temporary";
		//form.keepExtensions = true;
		
		form.parse(req, function(error, fields, files) {
			// @FIXME when i upload more than one file ,the arguments files is only single file
			// but i can get all files information form form.openedFiles
			// it confused me
			//console.log(1234,arguments);
			
			files = form.openedFiles;
			
			callBack(error,fields, files);
		
		});
	}else{
		var fields = querystring.parse(req.url.split('?')[1]);
		callBack(null,fields,[]);
	}
}

//parse URL
exports.url = function(url){
	var url = url||'';
	//filter url code '../'
		url = url.replace(/\.\.\//g,'');
	
	var a = url.split(/\?/);
	var b = a[0].replace(/^\/|\/$/g,'');
	var obj = {
		'pathname' : a[0],
		'search' : a[1],
		'filename' : null,
		'pathnode' : b.length?b.split(/\//):[],
	};
	
	obj['root'] = '/' + (obj['pathnode'][0]||'');
	
	if(obj['pathname'].match(/\/\w+\.\w+$/)){
		obj.pathnode.pop();
		obj.filename = obj['pathname'].match(/\/(\w+\.\w+$)/)[1];
	}
	return obj;
}




















