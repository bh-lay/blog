/*
 * @author bh-lay
 */

var ajaxConfig = {
	'add_edit':'add&edit',
	'share':'share_get',
	'opus':'opus_get',
	'blog':'article_get',
	'user':'user',
	'user_group':'user/user_group_add&edit',
	'temp':'temp',
	'tempModify':'tempModify',
	'login':'login',
	'del' : 'del',
	'upload':'upload',
	'clear_cache':'clear_cache'
};

exports.deal = function (req,res_this,path){
	var modul = path.pathnode[1];
	if(ajaxConfig[modul]){
		require('../ajax/'+ajaxConfig[modul]).render(req,res_this,path);
	}else{
		res_this.json({
			'code' : 2,
			'msg' : 'plese check this ajax url !'
		});
	}
}
