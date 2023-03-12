/**
 * @author bh-lay
 */
import fs, { promises } from 'fs'
import zlib from 'zlib'
import http, { OutgoingHttpHeaders } from 'http'

type typeFileParam = {
	root: string
	maxAge: number
}
type typeResponse = http.ServerResponse<http.IncomingMessage> & {
	req: http.IncomingMessage;
}
// 定义文件类型 Mime-Type
const baseMimes: Record<string, string> = {
	html : 'text/html',
	js : 'application/x-javascript',
	json : 'application/json',
	css : 'text/css',
	ico : 'image/x-icon',
	jpg : 'image/jpeg',
	png : 'image/png',
	gif : 'image/gif',
	rar : 'application/zip',
	zip : 'application/zip',
	pdf : 'application/pdf',
	txt : 'text/plain'
}

export default async function fileReadController(path: string, reqHeaders: http.IncomingHttpHeaders, res: typeResponse, options: typeFileParam) {
	// 匹配文件扩展名
	const maxAge = options.maxAge
	const pathname_split = path.match(/.\.([^.]+)$/)
	let ext = pathname_split ? pathname_split[1] : null

	let realPath: string
	// add a default files for directory
	if(ext == null) {
		ext = 'html'
		realPath = options.root + path + '/index.html'
	}else{
		realPath = options.root + path
	}
	const content_type = baseMimes[ext] || 'unknown'

	const fileStat = await promises.stat(realPath)
	const lastModified = fileStat.mtime.toUTCString()
	if(reqHeaders['if-modified-since'] && (lastModified == reqHeaders['if-modified-since'])) {
		// 使用缓存
		res.writeHead(304)
		res.end()
		return
	}

	const expires = new Date(new Date().getTime() + maxAge * 1000),
	headers: OutgoingHttpHeaders = {
		'Content-Type': content_type,
		'Expires' : expires.toUTCString(),
		'Cache-Control' : 'max-age=' + maxAge,
		'Last-Modified' : lastModified,
		'Access-Control-Allow-Origin' : '*'
	},
	acceptEncoding = reqHeaders['accept-encoding'],
	stream = fs.createReadStream(realPath),
	gzipStream = zlib.createGzip()

	if(acceptEncoding && acceptEncoding.indexOf('gzip') != -1) {
		headers['Content-Encoding'] = 'gzip'
		res.writeHead(200, headers)
		stream.pipe(gzipStream).pipe(res)
	}else{
		res.writeHead(200, headers)
		stream.pipe(res)
	}
}