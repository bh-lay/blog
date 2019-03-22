
/*
 * @author bh-lay
 */

let DB = require('../../../core/DB.js')

module.exports = function get_list(data, callback) {
	let limit_num = parseInt(data['limit']) || 10
	let skip_num = parseInt(data['skip']) || 0
	let findKeys = {}

	// 过滤标签
	if(data.tag){
		findKeys.tags = data.tag
	}
	DB.getCollection('labs')
		.then(({collection, client}) => {
			// count the all list
			let resJSON = {
				code: 1,
				limit: limit_num,
				skip: skip_num,
			}
			collection.countDocuments(findKeys,function(err,count){
				resJSON['count'] = count
				collection.find(findKeys,{
					limit: limit_num
				}).sort({
					time_show: -1
				}).skip(skip_num).toArray(function(err, docs) {
					client.close()
					if(err){
						resJSON.code = 2
					}else{
						for(let i in docs){
							delete docs[i]['content']
						}
						resJSON['list'] = docs
					}
					callback&&callback(resJSON)
				})
			})
		}).catch(() => {
			callback&&callback({
				code: 500
			})
			return
		})
  
}