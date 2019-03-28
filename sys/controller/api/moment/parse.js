
/**
 * @author bh-lay
 * 
 */

module.exports = data => {
	let params = {
		id : data['id'] || null,
		userid : data['userid'] || null,
		title: decodeURI(data['title']),
		cover: data['cover']||'',
		content: data['content'],
		originalUrl: data['originalUrl'],
		tags: data['tags'] ? data['tags'].split(/\s*,\s*/) : [],
		createTime: data['time_show'] || new Date().getTime().toString()
	}
	return !(params['title'] && params['content']) ? null : params
}