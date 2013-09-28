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

var tpl = require('../mod/module_tpl');

exports.render = function (req,res_this){
	var search = req.url.split('?')[1];
	var resJSON = {};
	if(search){
		var data = search.split('-'),
			total = data.length,
			over_count = 0;
		for(var i=0; i<total ;i++){
			(function(i){
				tpl.get(data[i],function(temp){
					resJSON[data[i]] = temp;
					over_count++;
					all_callBack()
				});
			})(i);
		}
		function all_callBack(){
			if(over_count == total){
				res_this.json(resJSON);
			}
		}
	}else{
		resJSON['code'] = 2;
		resJSON['msg'] = 'please use "tempA-tempB-tempC" to get temp !';
		res_this.json(resJSON);
	}
}
