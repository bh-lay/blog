/**
 *	@author bh-lay
 * @git : https://github.com/bh-lay/loader
 * 
 * @demo
 * var require = new loader({ 
 * 	'lanternJS' : '/src/js/lantern.js',
 * 	'lanterncss' : '/src/css/lantern.css',
 * 	'lofox' : '/src/js/lofox.js'
 * });
 * require.load('lanternJS',callBack);
 * require.load('lanternCSS,lofox',callBack);
 * require.load('/src/js/lantern.js,/src/js/lofox.js',callBack);
 */

(function(exports){
	var loadHistory = {};
	
	function loadJS(url,fn){
		$.ajax({
			'url' : url,
			'success' : function(){
				fn&&fn();
			}
		});
	}
	function loadTXT(url,fn){
		$.ajax({
			'url' : url,
			'success' : function(d){
				fn&&fn(d);
			}
		});
	}
	function loadCSS(url,fn){
		$('head').append('<link href="' + url + '" type="text/css" rel="stylesheet">');
		fn&&fn();
	}
	//start loading
	function load_start(url,callback){
		var ext = url.match(/\..+$/)[0];
		if(ext == '.css'){
			loadCSS(url,function(){
				callback&&callback(null);
			});
		}else if(ext == '.js'){
			loadJS(url,function(){
				callback&&callback(null);
			});
		}else{
			loadTXT(url,function(txt){
				callback&&callback(null,txt);
			});
		}
	}
	//check history load state
	function loading(url,callback){
//		console.log('loader','load check:',url);
		loadHistory[url] = loadHistory[url] || 'waiting';
		switch (loadHistory[url]){
			case 'done':
				//already loaded
				callback&&callback(null);
			break
			case 'loading':
				//is loading waiting
				var wait = setInterval(function(){
					if(loadHistory[url] = 'done'){
						clearInterval(wait);
						callback&&callback(null);
					}
				},100);
			break
			case 'waiting':
//				console.log('loader','loading:',url);
				loadHistory[url] = 'loading';
				load_start(url,function(err,txt){
//					console.log('loader','loaded:',url);
					loadHistory[url] = 'done';
					if(txt){
						callback&&callback(err);
					}else{
						callback&&callback();
					}
				});
			break
		}
	}
	var filter_url = function(str,callback){
		//filter url search
		var str = str ? str.split(/\?/)[0] : '';
		if(str.match(/\..+$/)){
			//param is url
			callback&&callback(null,str);
		}else{
			//param is module name
			var modName = str;
			var url = this.CONF[modName] || null;
			if(!url){
				callback&&callback('could not find module please check mod spell');
			}else{
				callback&&callback(null,url);
			}
		}
	};
	function LOADER(config){
		this.CONF = config || {};
	}
	LOADER.prototype.load = function(str,callback){
		//param is not exist or null  end this Fn
		if(!str || str.length < 1){
			return
		}
		var callback = callback || null;
		//split param
		var list = str.split(/\,/),
			 len = list.length;
		//complete num
		var complete_num = 0;
		//error num
		var error_num = 0;
		for(var i = 0;i<len;i++){
			filter_url.call(this,list[i],function(err,url){
				loading(url,function(err,txt){
					if(err){
						error_num++;
					}
					complete_num++;
			//		console.log(url,complete_num);
					if(complete_num == len){
						callback&&callback(txt);
					}
				});
			});
		}
	};
	/*
	LOADER.prototype.loadSync = function(str,callback){
			//param is not exist or null  end this Fn
		if(!str || str.length < 1){
			return
		}
		var callback = callback || null;
		//split param
		var list = str.split(/\,/),
			 len = list.length;
		//complete num
		var complete_num = 0;
		//error num
		var error_num = 0;
		for(var i = 0;i<len;i++){
			filter_url.call(this,list[i],function(err,url){
				loading(url,function(err){
					if(err){
						error_num++;
					}
					complete_num++;
			//		console.log(url,complete_num);
					if(complete_num == len){
						callback&&callback(error_num);
					}
				});
			});
		}
	};
	*/
	LOADER.prototype.image = function (src,parm){
		var parm = parm||{},
			 loadFn = parm['loadFn'] || null,
			 sizeFn = parm['sizeFn'] || null,
			 errorFn = parm['errorFn'] || null;
		
		var img = new Image();
		if(errorFn){
			img.onerror = function(){
				errorFn();
			}
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
	exports.loader = exports.loader || LOADER;
})(window);