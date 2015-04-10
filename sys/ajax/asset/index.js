/**
 * @author bh-lay
 */
var utils = require('../../core/utils/index.js');
var read = require('./fileList');
var upload = require('./upload');
var del = require('./delete');
var rename = require('./rename');
var createDir = require('./createDir');

function router(connect,app){
    var pathnode = connect.url.pathnode;
	if(pathnode.length == 2){
		utils.parse.request(connect.request,function(err,data){
			var pathStr = data.path;
			
			read.list(pathStr,function(err,files){
				var json = {
					code : 200,
					files : files
				}
				if(err){
					json.code = 404;
					json.msg = 'Directory does not exist!'
				}
				connect.write('json',json);
			});
		});
	}else if(pathnode.length == 3){
		if(pathnode[2] == 'upload'){
			upload.upload(connect.request,function(err,files){
				if(err){
					connect.write('json',{
						code : 201
					});
					return;
				}
				connect.write('json',{
					code : 200,
					files : files
				});
			});
		}else if(pathnode[2] == 'del'){
			del.file(connect.request,function(err){
				if(err){
					connect.write('json',{
						code : 201
					});
					return;
				}
				connect.write('json',{
					code : 200
				});
			});
		}else if(pathnode[2] == 'delDir'){
			connect.write('json',{
				code : 203
			});
		}else if(pathnode[2] == 'rename'){
			rename.rename(connect.request,function(err){
				if(err){
					connect.write('json',{
						code : 201
					});
					return;
				}
				connect.write('json',{
					code : 200
				});
			});
		}else if(pathnode[2] == 'createDir'){
			createDir.createDir(connect.request,function(err){
				if(err){
					connect.write('json',{
						code : 201
					});
					return;
				}
				connect.write('json',{
					code : 200
				});
			});
		}else{
            connect.write('json',{
			     code : 2,
			     msg : 'wrong path'
            });
        }
	}else{
		connect.write('json',{
			code : 2,
			msg : 'wrong path'
		});
	}
}
exports.render = function (connect,app){
	connect.session(function(session_this){
        if(session_this.get('user_group') == 'admin'){
            router(connect,app);
        }else{
            connect.write('json',{
                code : 201,
                msg : 'no power'
            });
            
        }
    });
}
