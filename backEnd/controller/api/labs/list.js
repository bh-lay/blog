
/*
 * @author bh-lay
 */

let DB = require('../../../core/DB.js')

module.exports = function get_list(data, callback) {
	let limit_num = parseInt(data['limit']) || 10
	let skip_num = parseInt(data['skip']) || 0
	let params = {}

	// 过滤标签
	if(data.tag){
		params.tags = data.tag
	}
	// 按照分页获取数据
	return DB.getDocsForPagination('labs', {
		params,
		limit: limit_num,
		skip: skip_num,
		sort: {
			time_create: -1
		}
	})
		.then(({count, docs}) => {
			// 删除正文
			for(let i in docs){
				delete docs[i]['content']
			}
			callback && callback({
				code: 1,
				limit: limit_num,
				skip: skip_num,
				count,
				list: docs
			})
		}).catch(() => {
			callback && callback({
				code: 2
			})
		})
}