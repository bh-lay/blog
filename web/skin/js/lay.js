/**
 *	@author
 * 
 */

var L=L||{};
var console = console || {'log' : function(a){}};

//L.require(mod or url,callBack);
(function(ex){
	var conf = {
		'lantern'	: {'js':'/skin/js/lib/lantern.js'},
		'juicer'	: {'js':'/skin/js/lib/juicer.js'},
		'dialog'	: {'js':'/skin/js/lib/dialog.js'},
	};

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
		str = str.split(/\?/)[0]||'';
		var str_spilt = str.split(/\./);
		var callback = callback||function(){};

		if(str_spilt.length == 1){
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
					conf[modName]['load'] = true;
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

/**
 *  load image
 *  L.loadImg(src,{'loadFn','sizeFn'});
 */
(function(ex){
	var init=function (src,parm){
		var parm = parm||{};
		var img=new Image();
		if(parm.loadFn){
			img.onload = function(){
				parm.loadFn(img.width,img.height);
			}
		}
		if(parm.sizeFn){
			var timer = setInterval(function(){
				if(img.width>1){
					clearInterval(timer);
					parm.sizeFn(img.width,img.height);
				}
			},2)
		}
		
		img.src=src;
	}
	ex.loadImg = init;
}(L));