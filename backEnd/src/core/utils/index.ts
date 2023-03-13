import { promises } from 'fs'
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

// 检查文件是否存在
export function isFileExists(filePath: string) {
	return promises.stat(filePath).then(() => {
		return true
	}).catch(() => {
		return false
	})
}