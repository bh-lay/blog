
/*
 * @author bh-lay
 */
import { routeItemMatched, Connect } from '@/core/types'
import DB from '@/core/DB'

export default async function (route: routeItemMatched, connect: Connect) {
	const params = connect.url.search
	const limit_num = parseInt(params.limit as string) || 10
	const skip_num = parseInt(params.skip as string) || 0

	// 按照分页获取数据
	const {count, docs} = await DB.getDocsForPagination('moment_tag', {
		params: {},
		limit: limit_num,
		skip: skip_num,
		sort: {
			count: -1
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