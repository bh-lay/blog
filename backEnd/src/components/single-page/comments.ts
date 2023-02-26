import { juicer } from '@/core/utils/index'
import getCommentList from '@/controller/api/comments/list'
import { componentContext } from '@/core/types'

export default async function(template: string, data: Record<string, unknown>, context: componentContext){
	const { list, count } = await getCommentList(context.connect, {
		limit: 10
	})
	return juicer(template, {
		list
	})
}