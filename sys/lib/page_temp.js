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
var tpl = require('../mod/module_tpl');

var temp_list = require('../conf/templates');

//method get
exports.get = function(mod,param,callback) {
	if(arguments.length<1){
		return 'please input template name !';
	}
	var mod = mod,
		param = param ;
		
	var URI = temp_list[mod];
	
	if(URI){
		var temp = fs.readFileSync(URI, "utf8");
		if(param.init){
			var need_temp = [],
				temp_data = {},
				over_count = 0;
				temp.replace(/\{-(\w*)-}/g,function(){
					need_temp.push(arguments[1]);
				});
			var total = need_temp.length;
			
			for(var i=0;i<total;i++){
				(function(i){
					tpl.get(need_temp[i],function(temp){
						temp_data[need_temp[i]] = temp;
						all_callBack(temp_data)
					});
				})(i);
			}
			function all_callBack(temp_data){
				over_count++;
				if(over_count == total){
					temp = temp.replace(/\{-(\w*)-}/g,function(){
						return temp_data[arguments[1]] || arguments[0];
					});
					callback(temp);
				}
			}
		}
	}else{
		callback('please check template name !');
	}
}
