import { promises as fs } from 'fs'
import http from 'node:http'
import { routeItemMatched, Connect, App } from '@/core/index'
import downloadFile from './download-file'
import { isFileExists, readFileToResponse } from './static-file'
import { base64Encode, base64Decode } from '@/lib/utils'
const imageRobotRoot = '/img-robber/'
function routeSourceToRemoteData(localTemporaryRoot: string, routeSource: string) {
	// 获取 URL 配置参数
	const urlSourceStr = base64Decode(routeSource)
	// 分割 URL 参数
	const urlSourceSplit = urlSourceStr.split(/-(?=http)/)
	// 判断是否合法
	if (urlSourceSplit.length === 0) {
		return null
	}
	// 获取图片原始地址和 referr 
	const [originUrl, referrUrl] = urlSourceSplit
	const extMatches = originUrl.match(/.\.([^.?#]+)((?:\?|#).*)?$/)
	const ext = extMatches ? extMatches[1] : 'jpg'
	// 生成新的文件名
	const cacheFileName = base64Encode(originUrl).replace(/\//g, '-') + '.' + ext
	// 生成新的文件地址
	return {
		cachePath: localTemporaryRoot + imageRobotRoot + cacheFileName,
		originUrl,
		referrUrl
	}
}
function isAllowedDomain(request: http.IncomingMessage) {
	const referer = request.headers.referer || ''
	const domainMatches = referer.match(/^http(?:s)?\:\/\/([^\/\:]+)(?:\/|\:|$)/)
	if (!domainMatches) {
		return false
	}
	const domain = domainMatches[1]
	if (domain === '127.0.0.1' || domain === 'localhost') {
		return true
	}
	return /bh-lay\.com$/.test(domain)
}
export async function get(route: routeItemMatched, connect: Connect, app: App){
	if (!isAllowedDomain(connect.request)) {
		return connect.writeJson({
			code: 3,
			msg: '此接口仅限小剧自己使用哦～'
		})
	}
	const routeParams = routeSourceToRemoteData(app.options.temporaryPath, route.params.source as string || '')
	if (!routeParams) {
		connect.writeJson({
			code: 2,
			msg: '获取图片失败 !'
		})
		return
	}
	const { cachePath, originUrl, referrUrl } = routeParams
	// 查看文件是否存在
	const fileExist = await isFileExists(cachePath)
	
	if (fileExist) {
		// 文件存在，直接读取文件
		return await readFileToResponse(cachePath, connect.request, connect.response)
	}
	try {
		// 文件不存在，先下载文件
		await downloadFile(originUrl, referrUrl, cachePath)
		// 下载成功，读取文件
		await readFileToResponse(cachePath, connect.request, connect.response)
	} catch(e) {
		// 下载失败
		connect.writeJson({
			code: 2,
			msg: 'load error !'
		})
		// 下载失败，删除可能已经下载到本地的文件
		await fs.unlink(cachePath)
	}
}