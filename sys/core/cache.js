/**
 * @author bh-lay
 * 
 * @demo
 *  cache.use('blog_list',['blog','ajax'],function(this_cache){
 *    //do something with this_cache
 *  },function(save_cache){
 *    //if none of cache,do this Fn ,in the end Fn1 with be start
 *    save_cache(this_cache);
 *  });
 */
var fs = require('fs');


/**
 * 缓存类
 *   useCache： 是否使用缓存
 *   cache_max_num：最多使用缓存数
 *   root：缓存存放目录
 */
function Cache(param){
    param = param || {};
    this.useCache = param.useCache;
    this.cache_max_num = param.max_num;
    //缓存存放目录
    this.root = param.root;
}

//清除缓存
Cache.prototype.clear = function(tags,callback){
  if(typeof(tags)=='string' && tags.length > 0){
    tags = tags.split(',');
    //精准清除
    this.try_del_each_cache(function(file_tags){
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
      return false;
    });
    callback&&callback();
  }else{
    //暴力清除
    this.try_del_each_cache();
    callback&&callback();
  }
};

/**
 * 使用缓存
 * 处理参数校验
 *  cache_name 缓存名
 *  tags 缓存标签
 *  callback 读取缓存后的回调函数
 *  create_content 没有缓存时，调用生成内容的回调函数
 */
Cache.prototype.use = function (cache_name,tags,callback,create_content){
    
    var me = this;
    if(typeof(cache_name) != 'string'){
        console.error('缓存名必须为字符格式');
        return
    }
    if(!tags || tags.length < 1){
        console.error('缓存必须指定标签');
        return
    }
    if((typeof(callback) != typeof(create_content)) || (typeof(create_content) != 'function')){
        console.error('使用缓存必须指定使用、创建函数');
        return
    }
    
    //读取配置是否需要使用缓存
    if(!this.useCache){
        create_content(function(new_cache){
            //通知调用方使用新的缓存
            callback(new_cache);
        });
        return;
    }
	cache_name = cache_name.replace(/\/|\?/g,'_');
    
    var tagsStr = tags.join('_');
    var cache_path = this.root + tagsStr + '--' + cache_name;
    
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
        create_content(function(new_cache){
          if(typeof(new_cache) == 'object'){
            //兼容JSON数据
            new_cache = JSON.stringify(new_cache);
          }
          //通知调用方使用新的缓存
          callback(new_cache);
          //保存缓存至对应目录
          fs.writeFile(cache_path,new_cache,function(err){
            if(err){
              console.log('create cache error',cache_name);
            };
          });
          //检查缓存数量
          fs.readdir(me.root,function(err,files){
            //缓存过多，清空
            if(!err && files.length > me.cache_max_num){
              me.try_del_each_cache();
            }
          });
      });
    }
  });
};


//尝试遍历删除缓存文件
Cache.prototype.try_del_each_cache = function(callback){
  var root = this.root;
  fs.readdir(root,function(err,files){
    if(err){
      return;
    }
    var total = files.length;
    
    for(var i = 0;i < total;i++){
      var filename_split = files[i].split('--'),
          tags = (filename_split[0] || '').split('_'),
          name = filename_split[1] || '';
      //跳过被忽略的文件
      if(files[i] == 'readMe.md' || files[i] == '.gitignore'){
        continue;
      }
      //没有定义检查函数，或者检查函数返回值为true，删除缓存
      if(!callback || callback(tags,name)){
        fs.unlink(root + files[i]);
      }
    }
  });
};

module.exports = Cache;