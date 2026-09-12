const blurCanvas = document.createElement('canvas')
const blurCtx = blurCanvas.getContext('2d') as CanvasRenderingContext2D
blurCanvas.width = screen.width
blurCanvas.height = screen.height

function saturate (src: Uint8ClampedArray, w: number, h: number, sv: number) {
	const len = w * h
	let pos: number, i: number, j: number, offset: number

	const lumR = (1 - sv) * 0.3086
	const lumG = (1 - sv) * 0.6094
	const lumB = (1 - sv) * 0.0820

	let r: number, g: number, b: number

	const shiftW = w << 2

	for (j = 0; j < h; j++) {
		offset = j * shiftW
		for (i = 0; i < w; i++) {
			pos = offset + (i << 2)

			r = src[pos]
			g = src[pos + 1]
			b = src[pos + 2]

			src[pos] = ((lumR + sv) * r) +
				(lumG * g) +
				(lumB * b)

			src[pos + 1] = (lumR * r) +
				((lumG + sv) * g) +
				(lumB * b)

			src[pos + 2] = (lumR * r) +
				(lumG * g) +
				((lumB + sv) * b)
		}
	}
	void len
}

function boxBlur (src: Uint8ClampedArray, w: number, h: number, r: number, sv: number) {
	const tmp = new Uint8Array(w * h * 4)
	blurRight(src, tmp, w, h, r)
	blurDown(tmp, src, w, h, r)
	blurLeft(src, tmp, w, h, r)
	blurUp(tmp, src, w, h, r);
	(sv !== undefined && sv !== 1) && saturate(src, w, h, sv)
}

function blurRight (src: Uint8ClampedArray, dest: Uint8Array, w: number, h: number, r: number) {
	let i: number, j: number, offset: number, pos: number, posR: number

	const shiftR = r << 2
	const shiftW = w << 2

	let weightR: number, weightG: number, weightB: number, weightA: number

	for (j = 0; j < h; j++) {
		weightR = 0
		weightG = 0
		weightB = 0
		weightA = 0

		offset = j * shiftW

		for (i = 0; i < r; i++) {
			pos = offset + (i << 2)

			weightR += src[pos]
			weightG += src[pos + 1]
			weightB += src[pos + 2]
			weightA += src[pos + 3]

			dest[pos] = (weightR / (i + 1)) | 0
			dest[pos + 1] = (weightG / (i + 1)) | 0
			dest[pos + 2] = (weightB / (i + 1)) | 0
			dest[pos + 3] = (weightA / (i + 1)) | 0
		}

		for (; i < w; i++) {
			pos = offset + (i << 2)
			posR = pos - shiftR

			dest[pos] = (weightR / r) | 0
			dest[pos + 1] = (weightG / r) | 0
			dest[pos + 2] = (weightB / r) | 0
			dest[pos + 3] = (weightA / r) | 0

			weightR += src[pos] - src[posR]
			weightG += src[pos + 1] - src[posR + 1]
			weightB += src[pos + 2] - src[posR + 2]
			weightA += src[pos + 3] - src[posR + 3]
		}
	}
}

function blurLeft (src: Uint8ClampedArray, dest: Uint8Array, w: number, h: number, r: number) {
	let i: number, j: number, offset: number, pos: number, posR: number

	const shiftR = r << 2
	const shiftW = w << 2

	let weightR: number, weightG: number, weightB: number, weightA: number

	for (j = 0; j < h; j++) {
		weightR = 0
		weightG = 0
		weightB = 0
		weightA = 0

		offset = j * shiftW

		for (i = w - 1; i >= w - r; i--) {
			pos = offset + (i << 2)

			weightR += src[pos]
			weightG += src[pos + 1]
			weightB += src[pos + 2]
			weightA += src[pos + 3]

			dest[pos] = (weightR / (w - i)) | 0
			dest[pos + 1] = (weightG / (w - i)) | 0
			dest[pos + 2] = (weightB / (w - i)) | 0
			dest[pos + 3] = (weightA / (w - i)) | 0
		}

		for (; i >= 0; i--) {
			pos = offset + (i << 2)
			posR = pos + shiftR

			dest[pos] = (weightR / r) | 0
			dest[pos + 1] = (weightG / r) | 0
			dest[pos + 2] = (weightB / r) | 0
			dest[pos + 3] = (weightA / r) | 0

			weightR += src[pos] - src[posR]
			weightG += src[pos + 1] - src[posR + 1]
			weightB += src[pos + 2] - src[posR + 2]
			weightA += src[pos + 3] - src[posR + 3]
		}
	}
}

function blurDown (src: Uint8Array, dest: Uint8ClampedArray, w: number, h: number, r: number) {
	let i: number, j: number, offset: number, pos: number, posR: number

	const shiftW = w << 2

	const offsetR = shiftW * r

	let weightR: number, weightG: number, weightB: number, weightA: number

	for (i = 0; i < w; i++) {
		weightR = 0
		weightG = 0
		weightB = 0
		weightA = 0

		offset = i << 2

		for (j = 0; j < r; j++) {
			pos = offset + (j * shiftW)

			weightR += src[pos]
			weightG += src[pos + 1]
			weightB += src[pos + 2]
			weightA += src[pos + 3]

			dest[pos] = (weightR / (j + 1)) | 0
			dest[pos + 1] = (weightG / (j + 1)) | 0
			dest[pos + 2] = (weightB / (j + 1)) | 0
			dest[pos + 3] = (weightA / (j + 1)) | 0
		}

		for (; j < h; j++) {
			pos = offset + (j * shiftW)
			posR = pos - offsetR

			dest[pos] = (weightR / r) | 0
			dest[pos + 1] = (weightG / r) | 0
			dest[pos + 2] = (weightB / r) | 0
			dest[pos + 3] = (weightA / r) | 0

			weightR += src[pos] - src[posR]
			weightG += src[pos + 1] - src[posR + 1]
			weightB += src[pos + 2] - src[posR + 2]
			weightA += src[pos + 3] - src[posR + 3]
		}
	}
}

function blurUp (src: Uint8Array, dest: Uint8ClampedArray, w: number, h: number, r: number) {
	let i: number, j: number, offset: number, pos: number, posR: number

	const shiftW = w << 2

	const offsetR = shiftW * r

	let weightR: number, weightG: number, weightB: number, weightA: number

	for (i = 0; i < w; i++) {
		weightR = 0
		weightG = 0
		weightB = 0
		weightA = 0

		offset = i << 2

		for (j = h - 1; j >= h - r; j--) {
			pos = offset + (j * shiftW)

			weightR += src[pos]
			weightG += src[pos + 1]
			weightB += src[pos + 2]
			weightA += src[pos + 3]

			dest[pos] = (weightR / (h - j)) | 0
			dest[pos + 1] = (weightG / (h - j)) | 0
			dest[pos + 2] = (weightB / (h - j)) | 0
			dest[pos + 3] = (weightA / (h - j)) | 0
		}

		for (; j >= 0; j--) {
			pos = offset + (j * shiftW)
			posR = pos + offsetR

			dest[pos] = (weightR / r) | 0
			dest[pos + 1] = (weightG / r) | 0
			dest[pos + 2] = (weightB / r) | 0
			dest[pos + 3] = (weightA / r) | 0

			weightR += src[pos] - src[posR]
			weightG += src[pos + 1] - src[posR + 1]
			weightB += src[pos + 2] - src[posR + 2]
			weightA += src[pos + 3] - src[posR + 3]
		}
	}
}

function blurRect (context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, sv?: number) {
	const ctx = context
	const canvas = ctx.canvas

	const srcW = w | 0
	const srcH = h | 0

	const srcX = x | 0
	const srcY = y | 0

	r = Math.min(Math.max(r, 8), 256)

	const resizeFactor = Math.max(0, ((Math.log(r) / Math.log(2)) - 3) | 0)
	const radius = r >>> resizeFactor

	const resizeWidth = canvas.width >>> resizeFactor
	const resizeHeight = canvas.height >>> resizeFactor

	blurCtx.drawImage(canvas, 0, 0, resizeWidth, resizeHeight)
	const imageData = blurCtx.getImageData(0, 0, resizeWidth, resizeHeight)

	boxBlur(imageData.data, resizeWidth, resizeHeight, radius, sv as number)

	blurCtx.putImageData(imageData, 0, 0)

	blurCtx.drawImage(
		blurCanvas,
		0, 0,
		resizeWidth, resizeHeight,
		0, 0,
		canvas.width, canvas.height
	)

	ctx.drawImage(
		blurCanvas,
		srcX, srcY,
		srcW, srcH,
		srcX, srcY,
		srcW, srcH
	)
	return ctx
}

export default blurRect
