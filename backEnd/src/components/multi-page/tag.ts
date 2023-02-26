import { juicer } from '@/core/utils/index'
import getTagList from '@/controller/api/blog/get-tag-list'

export default async function(template: string, data: any){
	const list = await getTagList()
	if(list.length > 100){
		list.length = 100
	}
	return juicer(template,{
		list: list,
		activeTag: data.tag
	})
}