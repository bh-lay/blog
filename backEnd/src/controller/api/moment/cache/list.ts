
/*
 * @author bh-lay
 */
import { routeItemMatched, Connect } from '@/core/types'
import DB from '@/core/DB'

export default async function (route: routeItemMatched, connect: Connect) {
	let data = connect.url.search

	let limit_num = parseInt(data.limit as string) || 10
	let skip_num = parseInt(data.skip as string) || 0
	let params = {}

	// 按照分页获取数据
	const {count, docs} = await DB.getDocsForPagination('moment_cache', {
		params,
		limit: limit_num,
		skip: skip_num,
		sort: {
			score: -1
		}
	})
	connect.writeJson({
		code: 1,
		limit: limit_num,
		skip: skip_num,
		count,
		list: docs
	})
}