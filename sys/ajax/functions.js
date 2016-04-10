/**
 * @author bh-lay
 */
var utils = require('../core/utils/index.js'),
    updateFriendsScore = require('../functions/updateFriendsScore.js');

function isAdmin( connect, successFn, failFn ){
	connect.session(function(session_this){
		if( session_this.get('user_group') == 'admin' ){
			successFn && successFn();
		}else{
			failFn && failFn();
		}
	});
}

module.exports = function ( connect, app, act ){
	if(connect.request.method != 'POST'){
		connect.write('json',{
			'code' : 201,
			'msg' : 'please use POST to clear cache !'
		});
		return;
	}
	isAdmin( connect, function(){	
		if( act == 'updateFriendsScore' ){
			updateFriendsScore.update(function(){
				connect.write('json',{
					'code' : 200,
					'msg' : 'update success !'
				});
			});
		}else{
			connect.write('json',{
				'code' : 203,
				'msg' : 'wrong action !'
			});
		}
	},function(){
		connect.write('json',{
			'code' : 201,
			'msg' : 'no power !'
		});
	});
}
