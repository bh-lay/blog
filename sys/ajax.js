/*
 * @author bh-lay
 */

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
	res.statusCode = 200 ;
	res.setHeader('Content-Type','application/json');
	res.setHeader('charset','utf-8');
	
	var modul = pathname.split('/').pop();
	if(ajaxConfig[modul]){
		require('./ajax/'+ajaxConfig[modul]).render(req,res);
	}else{
		res.end('{\'code\':2,\'msg\':\'plese check this ajax url !\'}');
	}
}
