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
	//定义私有变量
	var private_doc = document;
	var private_loader = private_doc.createElement('div');
	var private_body = private_doc.getElementsByTagName('body')[0];
	
	//初始化loader的dom环境
	private_loader.setAttribute('data-module' , 'loader');
	private_loader.style.display = 'none';
	private_body.appendChild(private_loader);
	
	//加载javascript
	function loadJS(url,fn){
		var script = private_doc.createElement('script');
		script.type = 'text/javascript';
		script.charset = 'UTF-8';
		script.onload = function() {
			fn&&fn();
		};
		script.src = url;
		private_loader.appendChild(script);
	}
	//加载CSS
	function loadCSS(url,fn){
		var link = private_doc.createElement('link');
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.onload = function() {
			fn&&fn();
		};
		link.href = url;
		private_loader.appendChild(link);
	}
	function loadTXT(url,fn){
		$.ajax({
			'url' : url,
			'success' : function(d){
				fn&&fn(d);
			}
		});
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