import DB from '@/core/DB'
import { typeResponse } from '@/core/index'
import { IncomingMessage } from 'node:http'

const cookieName = 'traceid'
function creatID () {
	return parseInt(Math.ceil(Math.random()*1000) + '' + new Date().getTime()).toString(36)
}
const getTraceIdID = (request: IncomingMessage, response: typeResponse) => {
	const cookieInRequest = request.headers.cookie || ''
	const reg = new RegExp(cookieName + '=([^\;]+)')
	const result = cookieInRequest.match(reg)
	if (result) {
		return result[1]
	} else {
		const id = creatID()
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
	const requestHeaders = request.headers || {}
	const referer = requestHeaders.referer || ''
	const time = new Date().getTime().toString()
	const ip = getClientIp(request)
	const ua = requestHeaders['user-agent']
	const traceid = getTraceIdID(request, response)
	const item = {
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

