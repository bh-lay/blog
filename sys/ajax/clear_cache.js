/**
 * @author bh-lay
 */

exports.render = function (req,res_this){
	//FIXME add power check
	parse.request(req,function(err,data){
		var type = data.type = data.type || '';

		if(type.match(/^(all|chip|html|ajax)$/)){
			cache.clear(type,function(){
				res_this.json({
					'code': 1,
					'msg' : 'clear cache :[' + type + '] completely !'
				});
			});
		}else{
			res_this.json({
				'code' : 201,
				'msg' : 'please input cache type !'
			});
		}
	});
}
