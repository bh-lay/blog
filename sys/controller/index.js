//author bh-lay
var temp = require('../lib/page_temp');

exports.deal = function (req,res_this){
	temp.get('index',{'init':true},function(page_temp){
		res_this.html(200,page_temp);
	});
}
