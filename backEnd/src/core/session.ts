/**
 * @author bh-lay
 */

/**
 * @seesion format
 * {ID:{time_create,time_expire,data}}
 * ID=Date.parse+Random
 * 
 * @expire_sheet format
 * 	date+hour
 * {
 *   '05-12':{
 *     sessionID:{},
 *     sessionID:{},
 *   },
 * }
 * 
 */

// FIXME 不要忘了删除过期的session

import { promises as fs } from 'fs'
import { isFileExists } from '@/controller/img-robber/static-file'

type typeSessionData = Record<string, unknown>
// 生成session id
function createSessionID() {
	return new Date().getTime() + '-' + Math.ceil(Math.random()*1000)
}
// 检测是否为正常session id
function isNormalSessionID(ID: string){
	return typeof ID === 'string' && ID.length > 3
}

/**
 * session类
 *
 **/
export default class Session {
	sessionID: string
	path: string
	data: typeSessionData
	powerCode: string
	createdTime: number
	constructor(
		sessionCacheRoot: string,
		cookieObj: Record<string, string | number>,
	) {
		if(!sessionCacheRoot){
			console.error('need seesion path')
		}
		// 检测session id 或创建
		this.sessionID = isNormalSessionID(cookieObj['session_verify'] as string) ? cookieObj['session_verify'] as string : createSessionID()
		this.path = sessionCacheRoot + this.sessionID + '.txt'
		this.powerCode = ''
		this.createdTime = 0
		this.data = {}
	}
	async init(writeCookie: (cookieObj: Record<string, unknown>) => void) {
		// find sessionID in session library
		const exists = await isFileExists(this.path)
		if(exists){
			// read session file
			const cacheContent = await fs.readFile(this.path,'utf-8')
			const JSON_file = JSON.parse(cacheContent)
			this.fillFromCache(JSON_file)
		} else{
			// create session file
			this.createdTime = new Date().getTime()
			this.data = {
				user_group : 'guest'
			}
			writeCookie({
				session_verify : this.sessionID,
				path : '/',
				'Max-Age' : 60 * 60 * 24 * 7,// session浏览器端保存七天
				HttpOnly : true// 前端脚本不可见
			})
		}
	}
	private fillFromCache(sessionCached: Record<string, unknown>) {
		this.data = sessionCached.data as typeSessionData
		this.powerCode = sessionCached.powerCode as string
		this.createdTime = sessionCached.createdTime as number
	}
	set (param: Record<string, unknown>){
		for(const i in param){
			if(i === 'powerCode'){
				this.powerCode = param[i] as string
			}else{
				this.data[i] = param[i]
			}
		}
		const pathname = this.path
		const data = JSON.stringify(this)
		fs.writeFile(pathname,data)
	}
	get(name: string){
		const this_session = this.data
		const getData = this_session[name] || null
		return getData
	}
	power(code: number){
		if(code && this.powerCode.split('')[code] === '1'){
			return true
		}else{
			return false
		}
	}
}
