import fs from 'fs'
import request from 'request'

// 下载文件
export default function downloadFile (fileUrl: string, refererUrl: string, writePath: string) {
	return new Promise((resolve, reject) => {
		try {
			const reqClient = request.get({
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
				.pipe(fs.createWriteStream(writePath))
				.on('error', () => {
					reject()
				})
				.on('finish', () => {
					resolve('')
				})
		} catch (e) {
			reject()
		}
	})
}
