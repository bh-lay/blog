/**
 * @author bh-lay
 * 
 * @demo
 * 	cache.chip('blog_list',function(this_cache){
 * 		//do something with this_cache
 * 	},function(save_cache){
 * 		//if none of cache,do this Fn ,in the end Fn1 with be start
 * 		save_cache(this_cache);
 * 	});
 */
var fs = require('fs');
var cache_max_num = 1000;

function cache(cache_name,callback,create_cache,root){
	var cache_root = './cache/' + root + '/';
	var cache_path = cache_root + cache_name + '.txt';
	
	fs.exists(cache_path, function(exists) {
		if(0 || exists){
			//get cache from cache directory
			fs.readFile(cache_path,'UTF-8',function(err,this_cache){
				if(err){
					consele.log('readFile error');
				}
				callback(this_cache);
			});
			
		}else{
			//create cache and save to cache
			create_cache(function(new_cache){
				callback(new_cache);
				//save cache to cache directory
				fs.writeFile(cache_path,new_cache,function(err){
					if(err){
						console.log('create cache error',cache_name);
					};
				});
			});
			//try to clear cache
			fs.readdir(cache_root,function(err,files){
				if(err){
					callback&&callback(err);
					return
				}
				var total = files.length;
				if(total > cache_max_num){
					clear_directory(cache_root);
				}
			});
		}
	});
};

function clear_directory(root_path,callback){
	
	fs.readdir(root_path,function(err,files){
		if(err){
			callback&&callback(err);
			return
		}
		var total = files.length;

		for(var i = 0;i < total;i++){
			if(files[i] != 'readMe.md'){
				fs.unlink(root_path + files[i]);
			}
		}
		callback&&callback(null);
	});
}


/**
 * cache.clear(root,name,fn)
 * cache.clear(root,fn)
 * 
 * root:chip/html/ajax
 */
function CLEAR(){
	//filter arguments
	var root = arguments[0] || '',
		name = null,
		callback = null;
	if(typeof(arguments[1]) == "function"){
		callback = arguments[1];
	}else if(typeof(arguments[1]) == "string"){
		name = arguments[1];
		if(typeof(arguments[2]) == "function"){
			callback = arguments[2];
		}
	}
	
	if(root.match(/^(chip|html|ajax)$/)){
		var root_path = './cache/' + root + '/';
		if(name){
			fs.unlink(root_path + name + '.txt',function(err){
				callback&&callback(err);
			});
		}else{
			clear_directory(root_path,callback);
		}
	}else if(root == 'all'){
		clear_directory('./cache/chip/');
		clear_directory('./cache/html/');
		clear_directory('./cache/ajax/');
		callback&&callback();
	}else{
		callback&&callback('arguments[0] error please use [all|chip|html|ajax]');
	}
}
// use cache exports
exports.clear = CLEAR;
exports.chip = function(cache_name,callback,create_cache){
	cache(cache_name,callback,create_cache,'chip');
};
exports.html = function(cache_name,callback,create_cache){
	cache(cache_name,callback,create_cache,'html');
};
exports.ajax = function(cache_name,callback,create_cache){
	var this_name = cache_name.replace(/\/|\?/g,'_'); 
	cache(this_name,callback,create_cache,'ajax');
};
