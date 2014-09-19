/**
 * @author bh-lay
 */
var querystring = require('querystring');
var formidable = require('formidable');
var crypto = require('crypto');


exports.cookie = function parseCookie(str){
	var str = str ||'';
	var cookieData = {};
	
	var list = str.split(';');
	
	for(var i = 0 , t = list.length ; i < t ; i++){
		var parseList = list[i].split('=');
		var nameStr = parseList[0]||'';
		var name = nameStr.replace(/^\s+|\s+$/g,'');
		var value = parseList[1]||'';
		
		cookieData[name] = value;
	}
	return cookieData;
}

/**
 * @param (timestamp/Date,'{y}-{m}-{d} {h}:{i}:{s}')
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
		return formatObj[arguments[1]]||arguments[0];
	});
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
	var fields = querystring.parse(req.url.split('?')[1]);
	
	if(method == 'POST' || method =='post'){
		var form = new formidable.IncomingForm();
		form.uploadDir = "./cache/upload";
		//form.keepExtensions = true;
		
		form.parse(req, function(error, fields_post, files) {
			// @FIXME when i upload more than one file ,the arguments files is only single file
			// but i can get all files information form form.openedFiles
			// it confused me
			
			files = form.openedFiles;
			//将URL上的参数非强制性的增加到post数据上
			for(var i in fields){
				if(!fields_post[i]){
					fields_post[i] = fields[i];
				}
			}
			
			callBack(error,fields_post, files);
		
		});
	}else{
		callBack(null,fields,[]);
	}
}



//parse URL
exports.url = function(url){
	var url = url||'';
	//filter url code '../'
		url = url.replace(/\.\.\//g,'');
	
	var a = url.split(/\?/);
	//去除首尾的“/”
	var b = a[0].replace(/^\/|\/$/g,'');
	var searchStr = a[1] || '';
	var search = querystring.parse(searchStr);
	
	var obj = {
		'pathname' : a[0],
		'search' : search,
		'filename' : null,
		'pathnode' : b.length?b.split(/\//):[],
	};
	
	obj['root'] = '/' + (obj['pathnode'][0]||'');
	
	if(obj['pathname'].match(/\/\w+\.\w+$/)){
		//obj.pathnode.pop();
		obj.filename = obj['pathname'].match(/\/(\w+\.\w+$)/)[1];
	}
	return obj;
}

exports.md5 = function(text) {
	text = text || '';
	if(typeof(text) != 'string'){
		text = text.toString();
	}
	return crypto.createHash('md5').update(text).digest('hex');
};

exports.encodeHtml = function(s){
	return (typeof s != "string") ? s : s.replace(/"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g,function($0){
		var c = $0.charCodeAt(0), r = ["&#"];
		c = (c == 0x20) ? 0xA0 : c;
		r.push(c); r.push(";");
		return r.join("");
	});
};