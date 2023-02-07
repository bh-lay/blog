
/**
 * @author bh-lay
 * 
 */

module.exports = data => {
	let params = {
		'id': data['id'] || null,
		'name': data['name'] || '',
		'title': decodeURI(data['title']),
		'cover': data['cover'] || '',
		'time_create': data['time_create'] || new Date().getTime(),
		'content': data['content'],
		'git_full_name': data['git_full_name'],
		'demo_url': data['demo_url'],
		'intro': data['intro'] || data['content'].slice(0, 200),
	}
	return !(params['title'] && params['content']) ? null : params
}