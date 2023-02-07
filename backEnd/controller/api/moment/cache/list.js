
/*
 * @author bh-lay
 */

let DB = require('../../../../core/DB.js')

module.exports = function get_list(data, callback) {
	let limit_num = parseInt(data['limit']) || 10
	let skip_num = parseInt(data['skip']) || 0
	let params = {}

	// 按照分页获取数据
	return DB.getDocsForPagination('moment_cache', {
		params,
		limit: limit_num,
		skip: skip_num,
		sort: {
			score: -1
		}
	})
		.then(({count, docs}) => {
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