/**
 * @author bh-lay
 */
import fs from 'fs'
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
const baseMimes = {
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
export default class FilerReader {
	staticFileRoot: string
	mime: Record<string, string>
	maxAge: number
	constructor (param: typeFileParam){
		this.staticFileRoot = param.root
		this.mime = baseMimes
		this.maxAge = param.maxAge || 60 * 60 * 24 * 365
	}
	read (path: string, req: http.IncomingMessage, res: typeResponse, notFound: () => void) {
		// 匹配文件扩展名
		const maxAge = this.maxAge
		const pathname_split = path.match(/.\.([^.]+)$/)
		let ext = pathname_split ? pathname_split[1] : null
	
		let realPath: string
		// add a default files for directory
		if(ext == null) {
			ext = 'html'
			realPath = this.staticFileRoot + path + '/index.html'
		}else{
			realPath = this.staticFileRoot + path
		}
		const content_type = this.mime[ext]||'unknown'
	
		fs.exists(realPath, function(exists) {
			if(!exists){
				notFound()
				return 
			}
	
			fs.stat(realPath, function(err, stat) {
				if(err) {
					/**
					 * 500 server error 
					 */
					res.writeHead(500)
					res.end('500')
					return
				}
				const lastModified = stat.mtime.toUTCString()
	
				if(req.headers['if-modified-since'] && (lastModified == req.headers['if-modified-since'])) {
					// 使用缓存
					res.writeHead(304)
					res.end()
				} else {
					const expires = new Date(new Date().getTime() + maxAge * 1000),
						headers: OutgoingHttpHeaders = {
							'Content-Type': content_type,
							'Expires' : expires.toUTCString(),
							'Cache-Control' : 'max-age=' + maxAge,
							'Last-Modified' : lastModified,
							'Access-Control-Allow-Origin' : '*'
						},
						acceptEncoding = req.headers['accept-encoding'],
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
			})
			
		})
	}
}
