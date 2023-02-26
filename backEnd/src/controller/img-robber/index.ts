import { promises as fs } from 'fs'
import { routeItemMatched, Connect, App } from '@/core/types'
import getAppConfig from '@/conf/app_config'
import downloadFile from './download-file'
import { isFileExists, readFileToResponse } from './static-file'
import { base64Encode, base64Decode } from '@/lib/utils'

export async function get (route: routeItemMatched, connect: Connect, app: App){
	// 获取 URL 配置参数
	let urlSourceStr = base64Decode(route.params.source as string || '')
	// 分割 URL 参数
	let urlSourceSplit = urlSourceStr.split(/-(?=http)/)
	// 判断是否能
	if (urlSourceSplit.length === 0) {
		connect.writeJson({
			code: 2,
			msg: '获取图片失败 !'
		})
		return
	}
	
	// 获取图片原始地址和 referr 
	let [imageOriginUrl, imageReeferrUrl] = urlSourceSplit
	// 生成新的文件名
	let fileName = base64Encode(imageOriginUrl).replace(/\//g, '-')
	// 生成新的文件地址
	let localFilePath = getAppConfig().imgRobber.root + fileName
	// 查看文件是否存在
	const fileExist = await isFileExists(localFilePath)
	
	if (fileExist) {
		// 文件存在，直接读取文件
		await readFileToResponse(localFilePath, connect.request, connect.response)
	}
	try {
		// 文件不存在，先下载文件
		await downloadFile(imageOriginUrl, imageReeferrUrl, localFilePath)
		// 下载成功，读取文件
		await readFileToResponse(localFilePath, connect.request, connect.response)
	} catch(e) {
		// 下载失败
		connect.writeJson({
			code: 2,
			msg: 'load error !'
		})
		// 下载失败，删除可能已经下载到本地的文件
		await fs.unlink(localFilePath)
	}
}