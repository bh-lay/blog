/*
 * @author bh-lay
 */

var utils = require('../../core/utils/index.js'),
	updateLabsDataFromGithub = require('../../functions/updateLabsDataFromGithub.js');

exports.render = function (connect,app){
	var url = connect.request.url;
	//强制使用POST方法
	if(connect.request.method != 'POST'){
		connect.write('json',{
			'code' : 201,
			'msg' : 'please use POST method !'
		});
		return;
	}

	//解析参数
	utils.parse.request(connect.request,function(err,data){
	    var repo_name = data.repo_name || '',
	    	id = data.id || '';
	    if(repo_name.length + id.length < 6){
			connect.write('json',{
				code: 205,
				msg: '参数不全'
			});
			return
	    }
	    connect.session(function(session_this){
    		var user_group = session_this.get('user_group');
    		if(user_group != "admin"){
				connect.write('json',{
					code: 201,
					msg: '没有权限'
				});
				return
			}
			connect.write('json',{
				code: 200,
				msg: 'success'
			});
			//更新
			updateLabsDataFromGithub.item(data.repo_name,data.id);
		});
	});
}