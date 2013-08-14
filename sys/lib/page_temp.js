/**
 * @author bh-lay
 *
 * get template that we have defined !
 * 
 * exports.get(mod_name,{init:true});
 *	  {init :true} replace public template
 *    {init :false} return original text
 *  
 */

var fs = require('fs');
var tpl = require('../lib/module_tpl');

var temp_list = require('../conf/templates');

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
			
			temp = temp.replace(/\{-(\w*)-}/g,function(){
				if(tpl.get(arguments[1])){
					return tpl.get(arguments[1]);
				}else{
					return arguments[0];
				}
			});
		}
		return temp ;
	}else{
		return 'please check template name !';
	}
}

