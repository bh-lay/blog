/**
 * @author bh-lay
 */
var fs = require('fs');
//FIXME write clear cache event
//var events = require('events');

function cache(cache_name,callback,create_cache,root){
	var cache_path = './cache/' + root + '/' + cache_name + '.txt';
	
	fs.exists(cache_path, function(exists) {
		if(exists){
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
		}
	});
};

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
exports.clear = function(root,callback){
	if(root.match(/^(chip|html|ajax)$/)){
		var root = './cache/' + root + '/';
		fs.readdir(root,function(err,files){
			var total = files.length;

			for(var i = 0;i < total;i++){
				if(files[i] != 'readMe.md'){
					fs.unlink(root + files[i]);
				}
			}
			callback&&callback();
		});
	}else{
		callback&&callback();
	}
}
/*////////////////////////////////////////////////////
@demo
------------------------------------------------------
	cache.chip('blog_list',function(this_cache){
		//do something with this_cache
	},function(save_cache){
		//if none of cache,do this Fn ,in the end Fn1 with be start
		save_cache(this_cache);
	});
////////////////////////////////////////////////////*/