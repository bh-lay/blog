/*
 * @author bh-lay
 */

var ajaxConfig = require('./conf/ajax');

exports.deal = function (req,res,res_this,pathname){
	
	var res_this = response.start(req,res);
	
	var modul = pathname.split('/').pop();
	if(ajaxConfig[modul]){
		require('./ajax/'+ajaxConfig[modul]).render(req,res_this,res);
	}else{
		res_this.json({
			'code' : 2,
			'msg' : 'plese check this ajax url !'
		});
	}
}
