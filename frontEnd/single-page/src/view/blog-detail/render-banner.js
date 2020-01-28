import canvasBlur from '@/assets/js/canvas-blur.js'
import filters from '@/filters/index.js'

// 图片预加载
function loadImg (src) {
	return new Promise((resolve, reject) => {
		if (!src) {
			return reject(new Error('no path'))
		}
		let img = new Image()
		img.crossOrigin = 'Anonymous'

		img.onerror = function () {
			reject(new Error('image error'))
		}
		img.onload = function End () {
			resolve(img)
		}
		img.src = src
	})
}
function renderBanner (headerNode, originCoverUrl) {
	if (!originCoverUrl || originCoverUrl.length === 0) {
		return
	}
	let coverUrl = filters.imgHosting(originCoverUrl, 'zoom', 420)

	loadImg(coverUrl)
		.then(img => {
			let width = headerNode.clientWidth
			let height = headerNode.clientHeight
			let canvas = document.createElement('canvas')
			let context = canvas.getContext('2d')
			// gaussBlur
			let newWidth = width
			let newHeight = width * img.height / img.width
			if (newHeight < height) {
				newHeight = height
				newWidth = height * img.width / img.height
			}
			let top = (height - newHeight) / 2
			let left = (width - newWidth) / 2
			canvas.width = width
			canvas.height = height
			context.drawImage(img, left, top, newWidth, newHeight)
			context.fillStyle = 'rgba(0,0,0,0.4)'
			context.fillRect(0, 0, width, height)
			canvasBlur(context, 0, 0, width, height, 8, 1)
			let bluredImg = canvas.toDataURL('image/png')
			headerNode.style.backgroundImage = `url(${bluredImg})`
		})
		.catch(() => {})
}

export default renderBanner
