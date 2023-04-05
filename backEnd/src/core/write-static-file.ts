/**
 * @author bh-lay
 */
import fs, { promises } from 'fs'
import zlib from 'zlib'
import http, { OutgoingHttpHeaders } from 'http'
import { mimes } from './utils/mimes'

type options = {
	maxAge: number,
  mimes: mimes,
}
type typeResponse = http.ServerResponse<http.IncomingMessage> & {
	req: http.IncomingMessage;
}

export default async function (filePath: string, reqHeaders: http.IncomingHttpHeaders, res: typeResponse, options: options) {
  // 匹配文件扩展名
  const pathnameSplit = filePath.match(/\/.[^\.]+\.([^.]+)$/)
  let extesion = pathnameSplit ? pathnameSplit[1] : ''

  // add a default files for directory
  if (!pathnameSplit) {
    extesion = 'html'
    filePath += '/index.html'
  }

  const fileStat = await promises.stat(filePath)
  const lastModified = fileStat.mtime.toUTCString()
  if (reqHeaders['if-modified-since'] && (lastModified == reqHeaders['if-modified-since'])) {
    // 使用缓存
    res.writeHead(304)
    res.end()
    return
  }

  const expires = new Date(new Date().getTime() + options.maxAge * 1000)
  const headers: OutgoingHttpHeaders = {
    'Content-Type': options.mimes[extesion] || 'unknown',
    'Expires': expires.toUTCString(),
    'Cache-Control': 'max-age=' + options.maxAge,
    'Last-Modified': lastModified
  }
  const	acceptEncoding = reqHeaders['accept-encoding']
  const stream = fs.createReadStream(filePath)
  const gzipStream = zlib.createGzip()

  return new Promise((resolve, reject) => {
    let pipeInstance = null
    if (acceptEncoding && acceptEncoding.indexOf('gzip') != -1) {
      headers['Content-Encoding'] = 'gzip'
      pipeInstance = stream.pipe(gzipStream).pipe(res)
    } else {
      pipeInstance = stream.pipe(res)
    }
    res.writeHead(200, headers)
    pipeInstance.on('error', (error) => {
      reject(error)
    })
      .on('finish', () => {
        resolve('')
      })
  })
}
