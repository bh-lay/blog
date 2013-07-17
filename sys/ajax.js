/*
 * @author bh-lay
 */

var response = require('./lib/response');

var ajaxConfig={
	'article':'article_add&edit',
	'share':'share_add&edit',
	'opus':'opus_add&edit',
	'blog':'article_get',
	'user':'user/user_add&edit',
	'user_group':'user/user_group_add&edit',
	'temp':'temp',
	'login':'login',
	'del' : 'del'
};

exports.deal = function (req,res,pathname){
	var modul = pathname.split('/').pop();
	if(ajaxConfig[modul]){
		require('./ajax/'+ajaxConfig[modul]).render(req,res);
	}else{
		res.end('{\'code\':2,\'msg\':\'plese check this ajax url !\'}');
	}
}
