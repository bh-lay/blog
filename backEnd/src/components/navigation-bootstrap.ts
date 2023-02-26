
export default async function(template: string, data: any){
	const active = data.active
	const html = template.replace(/{{{(\w+)}}}/g, function(a,b){
		return active == b ? 'active' : ''
	})
	return html
}