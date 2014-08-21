/**
 * @author bh-lay
 */
var parse = require('../lofox/parse.js');
 
exports.render = function (connect,app){
	if(connect.request.method != 'POST'){
		connect.write('json',{
			'code' : 201,
			'msg' : 'please use POST to clear cache !'
		});
		return;
	}
	//FIXME add power check
	parse.request(connect.request,function(err,data){
		var type = data.type || '';

		if(type.match(/^(all|chip|html|ajax)$/)){
			app.cache.clear(type,function(){
				connect.write('json',{
					'code': 200,
					'msg' : 'clear cache :[' + type + '] completely !'
				});
			});
		}else{
			connect.write('json',{
				'code' : 201,
				'msg' : 'please input cache type !'
			});
		}
	});
}
