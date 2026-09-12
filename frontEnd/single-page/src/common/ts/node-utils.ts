export function loadImg (src: string, callback?: () => void) {
	if (!src) {
		callback && callback()
		return
	}
	const img = new Image()
	// img.crossOrigin = 'Anonymous'

	let cb: (() => void) | null = callback || null

	function End () {
		cb && cb()
		cb = null
	}

	img.onerror = img.onload = End
	img.src = src
}
