export function loadImg (src, callback) {
	if (!src) {
		callback && callback()
		return
	}
	var img = new Image()
	// img.crossOrigin = 'Anonymous'

	function End () {
		callback && callback()
		callback = null
	}

	img.onerror = img.onload = End
	img.src = src
}