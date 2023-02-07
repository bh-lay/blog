let DB = require('../../core/DB.js')

let cookieName = 'traceid'
const creatID = () => {
	return parseInt(Math.ceil(Math.random()*1000) + '' + new Date().getTime()).toString(36)
}
const getTraceIdID = (request, response) => {
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
const getClientIp = req => {
	// x-forwarded-for容易被伪造
	let ip = req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null) || req.headers['x-forwarded-for']
	if (ip.indexOf('::ffff:') !== -1) {
		ip = ip.substring(7)
	}
	return ip
}
const addRecord = ({
	request,
	response,
	type,
	params
}) => {
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

	DB.getCollection('analysis')
		.then(({collection, client}) => {
			collection.insertOne(item)
		})
	return item
}

module.exports = addRecord
