/*
 * @author bh-lay
 */

var ajaxConfig = require('../conf/ajax');

exports.deal = function (req,res_this,path){
	var pathname = path.pathname;
	var modul = pathname.split('/').pop();
	if(ajaxConfig[modul]){
		require('../ajax/'+ajaxConfig[modul]).render(req,res_this);
	}else{
		res_this.json({
			'code' : 2,
			'msg' : 'plese check this ajax url !'
		});
	}
}
