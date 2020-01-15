import canvasBlur from '@/assets/js/canvas-blur.js'
import filters from '@/filters/index.js'

// 图片预加载
function loadImg (src, callback) {
	if (!src) {
		callback && callback()
		return
	}
	let img = new Image()
	img.crossOrigin = 'Anonymous'

	function End () {
		callback && callback(img)
		callback = null
	}

	img.onerror = img.onload = End
	img.src = src
}
function renderBanner (headerNode, originCoverUrl) {
	if (!originCoverUrl || originCoverUrl.length === 0) {
		return
	}
	let coverUrl = filters.imgHosting(originCoverUrl, {
		type: 'zoom',
		width: 420
	})

	loadImg(coverUrl, function (img) {
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
		// headerNode.appendChild(canvas)
		let bluredImg = canvas.toDataURL('image/png')
		headerNode.style.backgroundImage = `url(${bluredImg})`
	})
}

export default renderBanner
