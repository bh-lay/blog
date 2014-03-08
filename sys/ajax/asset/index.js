/**
 * @author bh-lay
 */
var read = require('./fileList');
exports.render = function (req,res_this,path){
	if(path.pathnode.length == 2){
		parse.request(req,function(err,data){
			var pathStr = data.path;
			
			read.list(pathStr,function(err,files){
				var json = {
					'code' : 1,
					'files' : files
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
