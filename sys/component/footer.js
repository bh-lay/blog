
exports.produce = function(temp,data,callback){
	
	var str = data.isSinglePage ? '<p><a class="backToOldVersion" href="javascript:void(0)">降级版本</a></p>' : '';
	var html = temp.replace(/{{{version}}}/g,str);
	callback && callback(null,html);
};