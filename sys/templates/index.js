//author bh-lay
var temp = require('../lib/page_temp');

exports.deal = function (req,res,res_this){
	var page_temp = temp.get('index',{'init':true});
	
	res_this.html(200,page_temp);
}
