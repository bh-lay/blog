/**
 * @author bh-lay
 * 
 * @demo
 * 	cache.use('blog_list',['blog','ajax'],function(this_cache){
 * 		//do something with this_cache
 * 	},function(save_cache){
 * 		//if none of cache,do this Fn ,in the end Fn1 with be start
 * 		save_cache(this_cache);
 * 	});
 */
var fs = require('fs');
var cache_max_num = 1000;
//缓存存放目录
var cache_root = './temporary/cache/';

/**
 * 读取、生成缓存
 * 不做参数校验
 *  cache_path 缓存对应的文件目录
 *  callback 读取缓存后的回调函数
 *  create_cache 没有缓存时，生成缓存的回调函数
 **/
function cache(cache_path,callback,create_cache){
    //检测此条缓存是否存在
	fs.exists(cache_path, function(exists) {
		if(exists){
			//存在，直接读取缓存
			fs.readFile(cache_path,'UTF-8',function(err,this_cache){
				if(err){
					consele.log('readFile error');
				}
				callback(this_cache);
			});
		}else{
			//不存在，调用创建缓存函数
			create_cache(function(new_cache){
				//通知调用方使用新的缓存
                callback(new_cache);
				//保存缓存至对应目录
				fs.writeFile(cache_path,new_cache,function(err){
					if(err){
						console.log('create cache error',cache_name);
					};
				});
			});
			//缓存过多，清除缓存
			fs.readdir(cache_root,function(err,files){
				if(err){
					return
				}
				if(files.length > cache_max_num){
					clear_directory(cache_root);
				}
			});
		}
	});
};

//清除目录
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
 * 清除缓存
 * cache.clear(root,name,fn)
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

//清除缓存
exports.clear = CLEAR;

/**
 * 使用缓存
 * 处理参数校验
 */
exports.use = function (cache_name,tags,callback,create_cache){
    if(typeof(cache_name) != 'string'){
        console.error('缓存名必须为字符格式');
        return
    }
    if(!tags || tags.length < 1){
        console.error('缓存必须指定标签');
        return
    }
    if((typeof(callback) != typeof(create_cache)) || (typeof(create_cache) != 'function')){
        console.error('缓存必须指定回调函数');
        return
    }
    
	cache_name = cache_name.replace(/\/|\?/g,'_'); 
    var cache_path = cache_root + tags.join('_') + '--' + cache_name + '.txt';
    cache(cache_path,callback,create_cache);
};
