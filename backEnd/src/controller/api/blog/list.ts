
/*
 * @author bh-lay
 */
import DB from '@/database/DB'
type listOption = {
	limit?: number
	skip?: number
	tag?: string
}
export default async function (data: listOption) {
	const limit_num = data.limit || 10
	const skip_num = data.skip || 0
	const params: Record<string, string> = {}

	// 过滤标签
	if(data.tag){
		params.tags = data.tag
	}
	// 按照分页获取数据
	const { count, docs } = await DB.getDocsForPagination('article', {
		params,
		limit: limit_num,
		skip: skip_num,
		sort: {
			time_show: -1
		}
	})
	// 删除正文
	for(const i in docs){
		docs[i]['content'] = undefined
	}
	return {
		code: 1,
		limit: limit_num,
		skip: skip_num,
		count,
		list: docs
	}
}