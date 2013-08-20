/**
 *	@author
 * L.require(mod,callBack);
 */

var L=L||{};
var console = console || {'log' : function(a){}};

(function(ex){
	var conf = {
		'lantern'	: {'js':'/skin/js/lib/lantern.js'},
		'juicer'		: {'js':'/skin/js/lib/juicer.js'},
		'dialog'		: {'js':'/skin/js/lib/dialog.js'},
	}

	function loadJs(url,fn){
		$.get(url,function(){
			fn&&fn();
		});
	}
	function loadCss(url,callback){
		
		$('head').append('<link href="'+url+'" type="text/css" rel="stylesheet">');
		callback&&callback();
	}
	var require = function(str,callback){
		var str = str||'';
		str =str.split(/?/)[0]||'';
		var str_spilt = str.split(/\./);
		var callback = callback||function(){};
		
		if(str_spilt.lenght == 1){
			//repuire from config
			var modName = str;
			var module = conf[modName];
			if(!module){
				console.log('could not find module please check mod spell ！');
			}else if(module['load']){
				callback();
			}else{
				var url = module['js'];
				loadJs(url,function(){
					conf[modName]['load'][0] = true;
					callback()
				});
			}
		}else{
			//repuire from url
			var url = str;
			var ext = str_spilt[1];
			if(ext == 'css'){
				loadCSS(url,function(){
					if(conf[modName]['load'][1]||!conf[modName]['css']){
						return;
					}
				});
			}else if(ext == 'js'){
				loadJs(url,callback);
			}else{
				console.log('could not support this type module ！');
			}
		}
	}
	ex.require = require;
}(L));