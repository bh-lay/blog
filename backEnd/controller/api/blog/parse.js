
/**
 * @author bh-lay
 * 
 */

module.exports = data => {
	let params = {
		id : data['id'] || null,
		title: decodeURI(data['title']),
		cover: data['cover']||'',
		time_show: data['time_show'] || new Date().getTime().toString(),
		tags: Array.isArray(data.tags) ? data.tags : [],
		author: data['author']||'',
		content: data['content'],
		intro: data['intro'] || data['content'].slice(0,200),
	}
	return !(params['title'] && params['content']) ? null : params
}