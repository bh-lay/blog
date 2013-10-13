/**
 *	@author bh-lay
 * 
 */


var console = console || {'log' : function(a){}};

/**
 * define namespace L
 *  
 * */
var L = L || function(root){
	//筛选元素
	function findDom(str,dom){
		var this_obj = [],
			 check = str.slice(0,1),
			 rooter = str.slice(1,1000);
		
		for(var s = 0,total = dom.length;s<total;s++){
			var d = dom[s];
			if(check=='#'){
				this_obj.push(d.getElementById(rooter));
			}else if(check=='.'){
				var allobj = d.getElementsByTagName("*");
				
				for(var i=0;i<allobj.length;i++){
					if(allobj[i].className==rooter){
						this_obj.push(allobj[i]);
					}
				}
			}else{
				this_obj = d.getElementsByTagName(str);
			}
		}
		return this_obj;
	}
	
	var root = root||'';
	//拆分路径
	var rootlist = root.split(/\s/)||[];
	//临时存放选择对象的容器
	var cache = [document];
	
	for(var i = 0 , total = rootlist.length;i<total; i++){ //循环路径
		cache = findDom(rootlist[i],cache);
	}
	return cache;
};

//L.require(mod or url,callBack);
(function(ex){
	var conf = {
		'lantern': {'js':'/skin/js/lib/lantern.js'},
		'juicer'	: {'js':'/skin/js/lib/juicer.js'},
		'dialog'	: {'js':'/skin/js/lib/dialog.js'},
		'lofox'	: {'js':'/skin/js/lib/lofox.js'},
		'codeArea'	: {'js':'/skin/js/lib/codeArea.js'}
	};

	function loadJs(url,fn){
		console.log('require','load JS file [' + url + ']');
		$.get(url,function(){
			fn&&fn();
		});
	}
	function loadCSS(url,callback){
		console.log('require','load CSS file [' + url + ']');
		if($('link[href="' + url + '"]').length == 0){
			$('head').append('<link href="' + url + '" type="text/css" rel="stylesheet">');
			callback&&callback();
		}else{
			console.log('require','[' + url + '] has been loaded, needn\'t to load again ！');
			callback&&callback();
		}
	}
	var start = function(str,callback){
		str = str || '';
		str = str.split(/\?/)[0]||'';
		var str_spilt = str.split(/\./);
		var callback = callback||function(){};

		if(str_spilt.length == 1){
			//repuire from config
			var modName = str;
			var module = conf[modName];
			if(!module){
				console.log('require','could not find module please check mod spell ！');
				return
			}
			switch (module['load']){
				case 'done':
					console.log('require','[' + modName + '] has been loaded, needn\'t to load again ！');
					callback();
				break
				case 'loading':
					var wait = setInterval(function(){
						if(conf[modName]['load'] = 'done'){
							clearInterval(wait);
							callback();
						}
					},100);
				break
				default :
					console.log('require:','loading start !');
					var url = module['js'];
					conf[modName]['load'] = 'loading';
					loadJs(url,function(){
						conf[modName]['load'] = 'done';
						callback()
					});
			}
		}else{
			//repuire from url
			var url = str;
			var ext = str_spilt[1];
			if(ext == 'css'){
				loadCSS(url,callback);
			}else if(ext == 'js'){
				loadJs(url,callback);
			}else{
				console.log('require','could not support this type module ！');
			}
		}
	};
	var require = function(str,callback){
		console.log('require:','start with [' + str + ']');
		var str = str||'',
			callback = callback || function(){},
			mod_list = str.split(/\,/),
			len = mod_list.length;
		
		if(len == 1){
			start(mod_list[0],callback);
		}else{
			var complete_num = 0;
			for(var i = 0;i<len;i++){
				start(mod_list[i],function(){
					complete_num++;
					if(complete_num == len){
						callback();
					}
				});
			}
		}
	}
	ex.require = require;
}(L));

/**
 *  load image
 *  L.loadImg(src,{'loadFn','sizeFn'});
 */
L.loadImg = function (src,parm){
	console.log('loadImg:','start with [' + src + ']');
	
	var parm = parm||{},
		loadFn = parm['loadFn'] || null,
		sizeFn = parm['sizeFn'] || null,
		errorFn = parm['errorFn'] || null;
	
	var img = new Image();
	img.onerror = function(){
		errorFn&&errorFn();
	};
	if(loadFn){
		img.onload = function(){
			loadFn(img.width,img.height);
		}
	}
	if(sizeFn){
		var timer = setInterval(function(){
			if(img.width>1){
				clearInterval(timer);
				sizeFn(img.width,img.height);
			}
		},2);
	}
	img.src=src;
};

//test css suports
L.supports = (function() {
   var div = document.createElement('div'),
      vendors = 'Khtml Ms O Moz Webkit'.split(' '),
      len = vendors.length;
  
   return function(prop) {
      if ( prop in div.style ){
      	return true;
      }
  
      prop = prop.replace(/^[a-z]/, function(val) {
         return val.toUpperCase();
      });

		for(var i = 0; i<len; i++){
			if ( vendors[len] + prop in div.style ) {
            // browser supports box-shadow. Do what you need.
            // Or use a bang (!) to test if the browser doesn't.
            break 
            return true;
         }
		}
      return false;
   };
})();