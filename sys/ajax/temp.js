/**
 * @author bh-lay
 */
/*
@demo

$.ajax({
	'type':'GET',
	'url':'/ajax/temp',
	'data':'nav-gallery',
	'success':function(d){
		console.log(d['gallery'])
	}
});
 * */

var tpl = require('../tpl/module_tpl');
var response = require('../lib/response');

exports.render = function (req,res){
	var search = req.url.split('?')[1];
	var resJSON = {};
	if(search){
		data = search.split('-');
		for(var i=0,total=data.length; i<total ;i++){
			resJSON[data[i]] = tpl.get(data[i]);
		}
	}else{
		resJSON['code'] = 2;
		resJSON['msg'] = 'plese tell use "tempA-tempB-tempC" to get temp !';
	}
	
	response.json(res,resJSON);
}
