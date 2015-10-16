/**
 * @author bh-lay
 */
var fs = require('fs');

var root = "../static/";

function handle_path(input){
	var output = root;
	if(input){
		//过滤｛../｝
		output += input.replace(/\.\.\//g,'/');
		output = output.replace(/^\//,'');
	}
	return output;
}

exports.list = function (pathStr,callback){
	var path = handle_path(pathStr);
	
	var res = [];
	fs.readdir(path,function(err,files){
		if(err){
			callback && callback(err);
			return
		}
		files.forEach(function(file){
			var pathname = path + '/' + file,
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
		callback && callback(null,res)
	});
};
