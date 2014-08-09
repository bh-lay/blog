/**
 * @author bh-lay
 */
var github = require('../lib/githubSDK.js');

function github_oauth(req,res_this,path){
	if(!path.search.code){
		return
	}
	var code = path.search.code;
	github.get_token(code,function(err,data){
		if(err){
			return
		}
		var access_token = data.access_token;
		github.userInfo({
			'access_token' : access_token
		},function(err,data){
			res_this.json({
				'err' : err,
				'data' : data
			});
		});
	});
}
//对外接口
exports.deal = function (req,res_this,path){
	var code = path.search.code || null;
	if(path.pathnode.length == 2){
		if(path.pathnode[1] == 'sina'){
			res_this.json({
				'path' : path
			});
		}else{
			github_oauth(req,res_this,path);
		}
	}else{
		res_this.json({
			'path' : path
		});
	}
};