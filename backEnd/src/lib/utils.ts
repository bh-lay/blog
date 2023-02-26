
export function base64Encode(str: string) {
	/* eslint-disable-next-line no-undef */
	return Buffer.from(str).toString('base64')
}
export function base64Decode(str: string) {
	/* eslint-disable-next-line no-undef */
	return Buffer.from(str, 'base64').toString()
}

export function encodeHtml (html: string) {
	if (typeof html !== 'string') {
		return html
	}
	/* eslint-disable no-control-regex */
	return html.replace(/<|>/g,function($0){
		let c = $0.charCodeAt(0)
		const r: (string | number)[] = ['&#']
		c = (c === 0x20) ? 0xA0 : c
		r.push(c)
		r.push(';')
		return r.join('')
	})
}
