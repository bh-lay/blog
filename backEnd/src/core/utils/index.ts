import { parseCookie, parseURL } from './parse'
import { typeResponse } from '../index'

export const parse = {
	cookie: parseCookie,
	url: parseURL,
}

// 写入cookie
export function writeCookie(cookieObj: Record<string, unknown>, response: typeResponse) {
	let cookie_str = ''
	for(const k in cookieObj){
		cookie_str += k + '=' + cookieObj[k] +';'
	}
	response.setHeader('Set-Cookie',cookie_str)
}
// exports.trim = function(str){
// 	return (str || '').replace(/^\s*|\s*$/g,'')
// }

