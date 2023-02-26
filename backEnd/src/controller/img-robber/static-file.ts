import fs, { promises } from 'fs'
import { typeResponse } from '@/core/types'
import { IncomingMessage, OutgoingHttpHeaders } from 'node:http'
import zlib from 'zlib'

const maxAge = 365 * 24 * 60 * 60

// 定义文件类型 Mime-Type
const mime = {
	jpg: 'image/jpeg',
	png: 'image/png',
	gif: 'image/gif'
}
// 检查文件是否存在
export function isFileExists(filePath: string) {
	return promises.stat(filePath).then(() => {
		return true
	}).catch(() => {
		return false
	})
}
// 响应文件
function responseFile(path: string, lastModifiedInFile: string, req: IncomingMessage, res: typeResponse) {
	// 尝试获取文件后缀名
	const pathnameMatches = path.match(/.\.([^.]+)$/)
	const ext = pathnameMatches ? pathnameMatches[1] : 'jpg'
	const contentType = ext === 'jpg' || ext === 'png' || ext ==='gif' ?  mime[ext] : 'unknown'

	const expires = new Date(new Date().getTime() + maxAge * 1000)

	const acceptEncoding = req.headers['accept-encoding']

	return new Promise((resolve, reject) => {
		const stream = fs.createReadStream(path)
		stream.on('error', (error) => {
			reject(error)
		})
		stream.on('finish', () => {
			resolve('')
		})
		const responseHeaders: OutgoingHttpHeaders = {
			'Content-Type': contentType,
			'Expires': expires.toUTCString(),
			'Cache-Control': 'max-age=' + maxAge,
			'Last-Modified': lastModifiedInFile,
			'Access-Control-Allow-Origin': '*'
		}
		if (acceptEncoding && acceptEncoding.indexOf('gzip') !== -1) {
			const gzipStream = zlib.createGzip()
			responseHeaders['Content-Encoding'] = 'gzip'

			res.writeHead(200, responseHeaders)
			stream.pipe(gzipStream).pipe(res)
		} else {
			res.writeHead(200, responseHeaders)
			stream.pipe(res)
		}
	})
}

/**
 * 文件读取器主方法（不预先检查文件是否存在）
 *
 **/
export function readFileToResponse(realPath: string, req: IncomingMessage, res: typeResponse) {
	// 检查文件状态
	return promises.stat(realPath)
		.then(stat => {
			// 检查缓存是否可用
			const lastModifiedInFile = stat.mtime.toUTCString()
			const lastModifiedInHttp = req.headers['if-modified-since'] || ''
		
			if (lastModifiedInFile === lastModifiedInHttp) {
				// 可以使用缓存，停止处理
				res.writeHead(304)
				res.end()
			} else {
				// 缓存无效，读取文件
				return responseFile(realPath, lastModifiedInFile, req, res)
			}
		})
		.catch(() => {
			res.writeHead(500)
			res.end('500')
		})
}
