let config = require('../../conf/app_config.js')
let staticFile = require('./static-file.js')
let downloadFile = require('./download-file.js')
const imgRobberRoot = config.imgRobber.root


const base64Encode = str => {
	return Buffer.from(str).toString('base64')
}
const base64Decode = str => {
	return Buffer.from(str, 'base64').toString()
}
exports.render = (route, connect) => {
	// 获取 URL 配置参数
	let urlSourceStr = base64Decode(route.param.source || '')
	// 分割 URL 参数
	let urlSourceSplit = urlSourceStr.split(/-(?=http)/)
	// 判断是否能
	if (urlSourceSplit.length === 0) {
		connect.write('json',{
			code: 2,
			msg: '获取图片失败 !'
		})
		return
	}
	
	// 获取图片原始地址和 referr 
	let [imageOriginUrl, imageReeferrUrl] = urlSourceSplit
	// 生成新的文件名
	let fileName = base64Encode(imageOriginUrl)
	// 生成新的文件地址
	let localFilePath = imgRobberRoot + fileName
	// 查看文件是否存在
	staticFile.isFileExists(localFilePath)
		.then(() => {
			// 文件存在，直接读取文件
			staticFile.fileReader(localFilePath, connect.request, connect.response)
		})
		.catch(() => {
			// 文件不存在，先下载文件
			downloadFile(imageOriginUrl, imageReeferrUrl, localFilePath)
				.then(() => {
					// 下载成功，读取文件
					staticFile.fileReader(localFilePath, connect.request, connect.response)
				})
				.catch(() => {
					// 下载失败
					connect.write('json',{
						code: 2,
						msg: 'load error !'
					})
					// 下载失败，删除可能已经下载到本地的文件
					staticFile.deleteFile(localFilePath)
				})
		})

}