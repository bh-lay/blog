
exports.produce = function(temp,data,callback){
	var active = data.active;
	var html = temp.replace(/{{{(\w+)}}}/g,function(a,b){
		return active == b ? 'active' : '';
	});
	callback && callback(null,html);
};