/**
 * @author bh-lay
 *
 *  get template we have defined !
 * exports.get(modname,{init:true});
 *
 */

var fs = require('fs');
var tpl = require('../tpl/module_tpl');

var temp_list = {
	'index' : {
		'src' : './templates/index.html',
		'Last-Modified' : null,
		'text' : null,
	}
}; 

//method get
exports.get = function(mod,param) {
	if(arguments.length<1){
		return 'please input template name !';
	}
	var mod = mod,
		param = param ;
		
	var temp = temp_list[mod];
	if(temp){
		var temp = fs.readFileSync(temp['src'], "utf8");
		if(param.init){
			temp = tpl.init(temp);
		}
		return temp ;
	}else{
		return 'please check template name !';
	}
}

