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
			//缓存过多，清空
			fs.readdir(cache_root,function(err,files){
				if(err){
					return
				}
				if(files.length > cache_max_num){
					try_del_each_cache();
				}
			});
		}
	});
};

//尝试遍历删除缓存文件
function try_del_each_cache(callback){
    if(!callback){
        callback = function(){
            return true;
        };
    }
	fs.readdir(cache_root,function(err,files){
		if(err){
			return
		}
		var total = files.length;
        
		for(var i = 0;i < total;i++){
			var filename = files[i];
            var tagsStr = filename.split('--')[0] || '';
            var fileTags = tagsStr.split('_');
            if(files[i] != 'readMe.md'){
                if( callback(fileTags)){
                    fs.unlink(cache_root + files[i]);
                }
			}
		}
	});
}


/**
 * 清除缓存
 * cache.clear(tags,fn)
 * 
 */
function CLEAR(tags,callback){
    //精准清除
    try_del_each_cache(function(file_tags){
        //遍历缓存文件的标签
        for(var i=0,total=file_tags.length; i<total; i++){
            var file_tag_item = file_tags[i];
            //遍历待删除缓存标签
            for(var s=0,all=tags.length; s<all; s++){
                var clear_tag_item = tags[s];
                //对比标签，相等就删除
                if(file_tag_item == clear_tag_item){
                    return true;
                }
            }
        }
        callback&&callback();
        return false;
    });
}

//清除缓存
exports.clear = function(tags,callback){
    if(typeof(tags)=='string' && tags.length > 0){
        tags = tags.split(',');
        CLEAR(tags,callback);
    }else{
        //暴力清除
		try_del_each_cache();
		callback&&callback();
	}
    
};

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
    
    var tagsStr = tags.join('_');
    var cache_path = cache_root + tagsStr + '--' + cache_name + '.txt';
    cache(cache_path,callback,create_cache);
};
