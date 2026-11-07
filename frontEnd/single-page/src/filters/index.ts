// 时间差计算
export function dateDiff (dateTimeStamp: number | string): string {
	const minute = 1000 * 60
	const hour = minute * 60
	const day = hour * 24
	const month = day * 30
	const year = day * 365
	const now = new Date().getTime()
	const diffValue = now - Number(dateTimeStamp)

	const yearC = diffValue / year
	const monthC = diffValue / month
	const weekC = diffValue / (7 * day)
	const dayC = diffValue / day
	const hourC = diffValue / hour
	const minC = diffValue / minute

	let result: string
	if (yearC >= 1) {
		result = parseInt(String(yearC)) + '年前'
	} else if (monthC >= 1) {
		result = parseInt(String(monthC)) + '个月前'
	} else if (weekC >= 1) {
		result = parseInt(String(weekC)) + '周前'
	} else if (dayC >= 1) {
		result = parseInt(String(dayC)) + '天前'
	} else if (hourC >= 1) {
		result = parseInt(String(hourC)) + '小时前'
	} else if (minC >= 1) {
		result = parseInt(String(minC)) + '分钟前'
	} else {
		result = '刚刚'
	}
	return result
}

export function imgHosting (url: string, type: 'zoom' | 'cover' | string = 'zoom', width: number = 300, height?: number): string {
	if (typeof url !== 'string') {
		return ''
	}
	if (url.length === 0 || url[0] !== '/') {
		return url
	}
	/* global CDN_PATH */
	let src = CDN_PATH + url

	if (type === 'zoom') {
		let confStr: string
		if (width) {
			confStr = 'w/' + width
		} else {
			confStr = 'h/' + height
		}
		src += '?imageView2/2/' + confStr + '/q/85'
	} else {
		// type === 'cover'
		const w = width || height
		const h = height || width
		src += '?imageView/1/w/' + w + '/h/' + h + '/q/85'
	}
	return src
}

export default { dateDiff, imgHosting }
