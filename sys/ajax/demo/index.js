/**
 * @author bh-lay
 */
var upload = require('./upload');

exports.render = function (connect,app){
	if(connect.url.pathnode.length == 2){
		connect.write('json',{
			'code' : 200,
			'msg' : 'this is demo ajax'
		});
	}else if(connect.url.pathnode.length == 3){
		if(connect.url.pathnode[2] == 'upload'){
			upload.upload(connect.request,function(data){
				connect.write('json',data);
			});
		}
	}else{
		connect.write('json',{
			'code' : 201,
			'msg' : 'wrong path'
		});
	}
}
