/**
 * 毫秒格式化
 */
function timeFormat (time, format = '{y}-{m}-{d} {h}:{i}:{s}') {
	let date = new Date(parseInt(time, 10))
	let formatObj = {
		y: date.getYear() + 1900,
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}

	let timeStr = format.replace(/{(y|m|d|h|i|s|a)}/g, (a, b) => {
		return formatObj[b] || 0
	})
	return timeStr
}

// 时间差计算
function dateDiff (dateTimeStamp) {
	let minute = 1000 * 60
	let hour = minute * 60
	let day = hour * 24
	let month = day * 30
	let year = day * 365
	let now = new Date().getTime()
	let diffValue = now - dateTimeStamp

	let yearC = diffValue / year
	let monthC = diffValue / month
	let weekC = diffValue / (7 * day)
	let dayC = diffValue / day
	let hourC = diffValue / hour
	let minC = diffValue / minute

	let result
	if (yearC >= 1) {
		result = parseInt(yearC) + '年前'
	} else if (monthC >= 1) {
		result = parseInt(monthC) + '个月前'
	} else if (weekC >= 1) {
		result = parseInt(weekC) + '周前'
	} else if (dayC >= 1) {
		result = parseInt(dayC) + '天前'
	} else if (hourC >= 1) {
		result = parseInt(hourC) + '小时前'
	} else if (minC >= 1) {
		result = parseInt(minC) + '分钟前'
	} else {
		result = '刚刚'
	}
	return result
}

// 跳转链接生成
function urlPrefix (url) {
	return '//bh-lay.com/r/' + btoa(encodeURIComponent(url))
}

// 跳转链接生成
function imgHosting (url, type = 'zoom', width = 300, height) {
	if (typeof (url) !== 'string') {
		return ''
	}
	if (url.length === 0 || url[0] !== '/') {
		return url
	}
	/* global CDN_PATH */
	let src = CDN_PATH + url

	if (type === 'zoom') {
		let confStr
		if (width) {
			confStr = 'w/' + width
		} else if (height) {
			confStr = 'h/' + height
		}
		src += '?imageView2/2/' + confStr + '/q/85'
	} else {
		// type === 'cover'
		let w = width || height
		let h = height || width
		src += '?imageView/1/w/' + w + '/h/' + h + '/q/85'
	}
	return src
}

let filters = { timeFormat, dateDiff, urlPrefix, imgHosting }
filters.install = function (Vue) {
	for (let filterKey in filters) {
		Vue.filter(filterKey, filters[filterKey])
	}
}
export default filters
