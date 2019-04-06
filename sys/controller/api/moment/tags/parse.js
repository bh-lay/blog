
/**
 * @author bh-lay
 * 
 */

module.exports = data => {
	let params = {
		id : data.id || '',
		name: decodeURI(data.name),
		discription: data.discription,
		createTime: data.createTime
	}
	if(params['id'].length < 2){
		params.createTime = new Date().getTime()
	}
	if(!params.name){
		return null
	}
	return params
}