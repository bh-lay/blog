
export default async function(template: string, data: any){
	var active = data.active
	var html = template.replace(/{{{(\w+)}}}/g, function(a,b){
		return active == b ? 'active' : ''
	})
	return html
}