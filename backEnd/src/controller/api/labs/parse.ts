
/**
 * @author bh-lay
 * 
 */

export default function(data: Record<string, unknown>) {
	const content = data.content as string || ''
	let params = {
		id: data.id || null,
		name: data.name || '',
		title: decodeURI(data.title as string || ''),
		cover: data.cover || '',
		time_create: data.time_create || new Date().getTime(),
		content,
		git_full_name: data.git_full_name,
		demo_url: data.demo_url,
		intro: data.intro || content.slice(0, 200),
	}
	return!(params.title && params.content) ? null : params
}
