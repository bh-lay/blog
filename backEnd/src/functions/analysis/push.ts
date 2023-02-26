import DB from '@/core/DB'
import { typeResponse } from '@/core/types'
import { IncomingMessage } from 'node:http'

let cookieName = 'traceid'
function creatID () {
	return parseInt(Math.ceil(Math.random()*1000) + '' + new Date().getTime()).toString(36)
}
const getTraceIdID = (request: IncomingMessage, response: typeResponse) => {
	let cookieInRequest = request.headers.cookie || ''
	let reg = new RegExp(cookieName + '=([^\;]+)')
	let result = cookieInRequest.match(reg)
	if (result) {
		return result[1]
	} else {
		let id = creatID()
		response.setHeader('Set-Cookie', `${cookieName}=${id}; path=/; HttpOnly`)
		return id
	}
}
function getClientIp(req: IncomingMessage): string {
	// x-forwarded-for容易被伪造
	// @ts-ignore
	let ip = req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null) || req.headers['x-forwarded-for']
	if (ip.indexOf('::ffff:') !== -1) {
		ip = ip.substring(7)
	}
	return ip
}
type options = {
	type: string,
	params: any
}
export default async function addRecord (request: IncomingMessage, response: typeResponse, {
	type,
	params
}: options) {
	let requestHeaders = request.headers || {}
	let referer = requestHeaders.referer || ''
	let time = new Date().getTime().toString()
	let ip = getClientIp(request)
	let ua = requestHeaders['user-agent']
	let traceid = getTraceIdID(request, response)
	let item = {
		referer,
		time,
		ip,
		ua,
		traceid,
		type,
		params
	}

	const {collection, client} = await DB.getCollection('analysis')
	collection.insertOne(item)
	return item
}

