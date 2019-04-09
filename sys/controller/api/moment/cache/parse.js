
/**
 * @author bh-lay
 * 
 */

module.exports = data => {
	var params = {
		id : data['id']||'',
		title: decodeURI(data['title']),
		avatar: data['avatar']||'',
		url: data['url']||'',
		isShow: data['isShow']||1,// 1:show;0:hidden
		adminScore: data['adminScore'] || 0,
		github_username : data.github_username || null,
		discription: data['discription']
	}
	if(params['id'].length < 2){
		params['time_create'] = new Date().getTime()
	}
	if(!(params['title']&&params['url'])){
		return null
	}
	return !(params['title'] && params['content']) ? null : params
}