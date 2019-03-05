let fs = require('fs')
let request = require('request')

// 下载文件
const downloadFile = (fileUrl, refererUrl, path) => {
	return new Promise((resolve, reject) => {
		try {
			let reqClient = request.get({
				url: fileUrl,
				headers: {
					'Referer': refererUrl
				}
			}, err => {
				if (err) {
					reject()
				}
			})

			reqClient
			.pipe(fs.createWriteStream(path))
			.on('error', () => {
				reject()
			})
			.on('finish', () => {
				resolve()
			})
		} catch (e) {
			reject()
		}
	})
}


module.exports = downloadFile