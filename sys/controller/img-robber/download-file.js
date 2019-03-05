let fs = require('fs')
let request = require('request')

// 下载文件
const downloadFile = (fileUrl, refererUrl, path) => {
	return new Promise((resolve, reject) => {
		request
			.get({
				url: fileUrl,
				headers: {
					'Referer': refererUrl
				}
			})
			.pipe(fs.createWriteStream(path))
			.on('error', () => {
				reject()
			})
			.on('finish', () => {
				resolve()
			})
			.on('close', () => {
				reject()
			})
	})
}


module.exports = downloadFile