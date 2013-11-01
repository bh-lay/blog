/**
 * @author bh-lay
 */
var fs = require('fs');

function getDir(root,callback){
	var res = [];
	fs.readdir(root,function(err,files){
		if(err){
			callback(err);
			return
		}
		files.forEach(function(file){
			var pathname = root + '/' + file,
				stat = fs.lstatSync(pathname);
	
			if (stat.isDirectory()){
				res.push({
					'name' : file,
					'isdir' : true
				});
			} else {
				res.push({
					'name' : file,
					'isdir' : false
				});
			}
		});
		callback(null,res)
	});
}

function filter_path(root){
	if(root){
		root = root.replace(/\.\.\//g,'/');
		root = root.replace(/^\//,'');
		return root;
	}else{
		return ''
	}
}

var root = 'D:/open/';
exports.render = function (req,res_this,path){
	if(path.pathnode.length == 2){
		parse.request(req,function(err,data){
			var path = filter_path(data.path);
			
			getDir(root + path,function(err,files){
				var json = {
					'code' : 1,
					'files' : files,
					'md5' : parse.md5(123)
				}
				if(err){
					json.code = 404;
					json.msg = 'Directory does not exist!'
				}
				res_this.json(json);
			});
		});
	
	}else{
		res_this.json({
			'code' : 2,
			'msg' : 'wrong path'
		});
	}
}
