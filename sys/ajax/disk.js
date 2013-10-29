/**
 * @author bh-lay
 */
var fs = require('fs');

exports.render = function (req,res_this,path){
	if(path.pathnode.length == 2){
		fs.readdir('D:/备份/ad',function(err,files){
			res_this.json([err,files]);
		});
	}else{
		res_this.json({
			'code' : 2,
			'msg' : 'wrong path'
		});
	}
}
