//author bh-lay
var temp = require('../tpl/page_temp');
var response = require('../lib/response');

exports.deal = function (req,res){
	var page_temp = temp.get('index',{'init':true});
	
	response.html(res,200,page_temp);
}
