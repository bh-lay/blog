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
						console.log('create cache chip error',cache_name);
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
exports.clear = function(root,callback){
	var chip_root = './cache/' + root + '/';
	fs.readdir(chip_root,function(err,files){
		var total = files.length;

		for(var i = 0;i < total;i++){
			if(files[i] != 'readMe.md'){
				fs.unlink(chip_root + files[i]);
			}
		}
		callback&&callback();
	});
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