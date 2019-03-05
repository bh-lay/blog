let fs = require('fs')
let zlib = require('zlib')
let maxAge = 365 * 24 * 60 * 60

// 定义文件类型 Mime-Type
let mime = {
	jpg: 'image/jpeg',
	png: 'image/png',
	gif: 'image/gif'
}
// 检查文件是否存在
const isFileExists = path => {
	return new Promise((resolve, reject) => {
		fs.exists(path, exists => {
			if (exists) {
				resolve()
			} else {
				reject(new Error('404'))
			}
		})
	})
}
// 获取文件状态
const getFileStat = path => {
	return new Promise((resolve, reject) => {
		fs.stat(path, function (err, stat) {
			if (err) {
				reject(new Error('500'))
			} else {
				resolve(stat)
			}
		})
	})
}
// 响应文件
const responseFile = (path, lastModifiedInFile, req, res) => {
	// 尝试获取文件后缀名
	let pathnameMatches = path.match(/.\.([^.]+)$/)
	let ext = pathnameMatches ? pathnameMatches[1] : 'jpg'
	let contentType = mime[ext] || 'unknown'

	let expires = new Date(new Date().getTime() + maxAge * 1000)
	let headers = {
		'Content-Type': contentType,
		'Expires': expires.toUTCString(),
		'Cache-Control': 'max-age=' + maxAge,
		'Last-Modified': lastModifiedInFile,
		'Access-Control-Allow-Origin': '*'
	}
	let acceptEncoding = req.headers['accept-encoding']
	let stream = fs.createReadStream(path)

	if (acceptEncoding && acceptEncoding.indexOf('gzip') != -1) {
		let gzipStream = zlib.createGzip()
		headers['Content-Encoding'] = 'gzip'
		res.writeHead(200, headers)
		stream.pipe(gzipStream).pipe(res)
	} else {
		res.writeHead(200, headers)
		stream.pipe(res)
	}
}

/**
 * 文件读取器主方法（不预先检查文件是否存在）
 *
 **/
function fileReader(realPath, req, res) {
	// 检查文件状态
	getFileStat(realPath)
		.then(stat => {
			// 检查缓存是否可用
			let lastModifiedInFile = stat.mtime.toUTCString()
			let lastModifiedInHttp = req.headers['if-modified-since'] || ''
		
			if (lastModifiedInFile == lastModifiedInHttp) {
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

exports.isFileExists = isFileExists
exports.fileReader = fileReader
exports.deleteFile = path => {
	fs.unlink(path, () => {})
}