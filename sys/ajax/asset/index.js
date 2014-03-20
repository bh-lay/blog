/**
 * @author bh-lay
 */
var read = require('./fileList');
var upload = require('./upload');
var del = require('./delete');
var rename = require('./rename');
var createDir = require('./createDir');

exports.render = function (req,res_this,path){
	if(path.pathnode.length == 2){
		parse.request(req,function(err,data){
			var pathStr = data.path;
			
			read.list(pathStr,function(err,files){
				var json = {
					'code' : 200,
					'files' : files
				}
				if(err){
					json.code = 404;
					json.msg = 'Directory does not exist!'
				}
				res_this.json(json);
			});
		});
	}else if(path.pathnode.length == 3){
		if(path.pathnode[2] == 'upload'){
			upload.upload(req,res_this);
		}else if(path.pathnode[2] == 'del'){
			del.del(req,res_this);
		}else if(path.pathnode[2] == 'rename'){
			rename.rename(req,res_this);
		}else if(path.pathnode[2] == 'createDir'){
			createDir.createDir(req,res_this);
		}
	}else{
		res_this.json({
			'code' : 2,
			'msg' : 'wrong path'
		});
	}
}
