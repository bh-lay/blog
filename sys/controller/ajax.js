/*
 * @author bh-lay
 */

var ajaxConfig = {
	'admin' : 'admin',
	'add_edit':'add&edit',
	'share':'share_get',
	'opus':'opus_get',
	'blog':'article_get',
	'labs':'labs_get',
	'user':'/user/index',
	'user_group':'user/user_group_add&edit',
	'power':'user/power',
	'temp':'temp',
	'tempModify':'tempModify',
	'del' : 'del',
	'upload':'upload',
	'clear_cache':'clear_cache',
	'asset':'asset/index',
	'friends':'friends_get'
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
