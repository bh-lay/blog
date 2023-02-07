
var getTagsList = require('../../controller/api/blog/getTagList.js'),
	utils = require('../../core/utils/index.js')

exports.produce = function(temp,data,callback){
	getTagsList(function(err,list){
		if(list.length > 100){
			list.length = 100
		}

		var html = utils.juicer(temp,{
			list: list,
			activeTag: data.tag
		})
		callback && callback(null,html)
	})
}
