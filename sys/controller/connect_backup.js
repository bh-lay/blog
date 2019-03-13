/**
 * @author bh-lay
 */
function github_oauth(req, res_this, path){
	res_this.json({
		path
	})
}
// 对外接口
exports.deal = function (req,res_this,path){
	if(path.pathnode.length == 2){
		github_oauth(req,res_this,path)
	}else{
		res_this.json({
			'path' : path
		})
	}
}