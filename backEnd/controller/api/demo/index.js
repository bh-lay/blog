/**
 * @author bh-lay
 */
var upload = require('./upload')

exports.upload = function (route, connect, app){
	upload.upload(connect.request,function(data){
		connect.write('json',data)
	})
}
