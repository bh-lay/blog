import { juicer } from '@/core/index'
import getCommentList from '@/controller/api/comments/list'
import { componentContext } from '@/core/index'

export default async function (template: string, data: Record<string, unknown>, context: componentContext) {
  const { list } = await getCommentList(context.connect, {
    limit: 10
  })
  return juicer(template, {
    list
  })
}