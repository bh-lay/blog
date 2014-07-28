/**
 * @author bh-lay
 */
var upload = require('./upload');

exports.render = function (req,res_this,path){
	if(path.pathnode.length == 2){
		res_this.json({
			'code' : 200,
			'msg' : 'this is demo ajax'
		});
	}else if(path.pathnode.length == 3){
		if(path.pathnode[2] == 'upload'){
			upload.upload(req,res_this);
		}else if(path.pathnode[2] == 'del'){
			del.file(req,res_this);
		}else if(path.pathnode[2] == 'delDir'){
			del.dir(req,res_this);
		}else if(path.pathnode[2] == 'rename'){
			rename.rename(req,res_this);
		}else if(path.pathnode[2] == 'createDir'){
			createDir.createDir(req,res_this);
		}
	}else{
		res_this.json({
			'code' : 201,
			'msg' : 'wrong path'
		});
	}
}
