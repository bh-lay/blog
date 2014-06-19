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
var component = require('../mod/component');
var juicer = require('juicer');
var baseRoot = './views/';

function replaceComponent(temp,callback){
	var need_temp = [],
		temp_data = {},
		over_count = 0;
		temp.replace(/\{{{(\w*)}}}/g,function(a,b){
			need_temp.push(b);
		});
	var total = need_temp.length;
	
	for(var i=0;i<total;i++){
		(function(i){
			component.get(need_temp[i],null,function(err,componentStr){
				temp_data[need_temp[i]] = componentStr;
				all_callBack(temp_data)
			});
		})(i);
	}
	if(total == 0){
		callback(null,temp);
	}
	function all_callBack(temp_data){
		over_count++;
		if(over_count == total){
			var html = temp.replace(/\{{{(\w*)}}}/g,function(a,b){
				return temp_data[b] || a;
			});
			callback(null,html);
		}
	}
}

exports.get = function(URI,data,callback){
	var realPath = baseRoot + URI;
	var data = data || {};
	data.frontEnd_base = CONFIG.frontEnd_root;
	//读取模版
	fs.readFile(realPath + '.html', "utf8",function(err,fileStr){
		if(err){
			callback && callback(err);
			return
		}
		//替换变量
		fileStr = juicer(fileStr,data);
//		fileStr = fileStr.replace(/\${(\w*)}/g,function(a,b){
//			return data[b] || '';
//		});
		
		//解析模版的component
		replaceComponent(fileStr,function(err,txt){
			var temp = txt;
			//查找脚本文件
			fs.exists(realPath + '.js', function(exists) {
				if(!exists){
					//没有脚本文件，直接返回模版内容
					callback && callback(null,temp);
					return ;
				}
				
				//执行视图对应的脚本文件
				require(realPath + '.js').produce(temp,null,function(){
					
				});
			});
		});
	});
};
