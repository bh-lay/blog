/**
 * @author bh-lay
 */

exports.render = function (req,res_this){
	//FIXME add power check
	parse.request(req,function(err,data){
		data.type = data.type||'';

		if(data.type == 'chip' || data.type == 'html'){
			cache.clear(data.type,function(){
				res_this.json({
					'code': 1,
					'msg' : 'clear cache :[' + data.type + '] completely !'
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
