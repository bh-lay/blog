
/**
 * @author bh-lay
 * 
 */

export default function (data: Record<string, unknown>) {
	const params = {
		id: data.id as string ||'',
		title: decodeURI(data.title as string || ''),
		avatar: data.avatar ||'',
		url: data.url ||'',
		isShow: data.isShow ||1,// 1:show;0:hidden
		adminScore: data.adminScore || 0,
		github_username : data.github_username || null,
		discription: data.discription,
		time_create: data.time_create
	}
	if(params.id.length < 2){
		params.time_create  = new Date().getTime()
	}
	if(!(params.title  || !params.url)){
		return null
	}
	return params
}