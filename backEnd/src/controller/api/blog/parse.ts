
/**
 * @author bh-lay
 * 
 */

export default function(data: Record<string, unknown>) {
	const content = data.content as string || ''
	let params = {
		id : data.id || null,
		title: decodeURI(data.title as string || ''),
		cover: data.cover ||'',
		time_show: data.time_show || new Date().getTime().toString(),
		tags: Array.isArray(data.tags) ? data.tags : [],
		author: data.author ||'',
		content,
		intro: data.intro as string || content.slice(0,200),
	}
	return (params['title'] && params['content']) ? params : null
}