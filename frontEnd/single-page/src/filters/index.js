import Vue from 'vue'

/**
 * 毫秒格式化
 */
Vue.filter('timeFormat', (time, format = '{y}-{m}-{d} {h}:{i}:{s}') => {
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
})

// 时间差计算
Vue.filter('dateDiff', dateTimeStamp => {
	let minute = 1000 * 60
	let hour = minute * 60
	let day = hour * 24
	let halfamonth = day * 15
	let month = day * 30
	let now = new Date().getTime()
	let diffValue = now - dateTimeStamp

	let monthC = diffValue / month
	let weekC = diffValue / (7 * day)
	let dayC = diffValue / day
	let hourC = diffValue / hour
	let minC = diffValue / minute

	let result
	if (monthC >= 1) {
		result = parseInt(monthC) + '个月前'
	} else if (weekC >= 1) {
		result = parseInt(weekC) + '周前'
	} else if (dayC >= 1) {
		result = parseInt(dayC) + '天前'
	} else if (hourC >= 1) {
		result = parseInt(hourC) + '个小时前'
	} else if (minC >= 1) {
		result = parseInt(minC) + '分钟前'
	} else {
		result = '刚刚'
	}
	return result
})
// 跳转链接生成
Vue.filter('urlPrefix', url => {
	return 'http://bh-lay.com/r/' + btoa(encodeURIComponent(url))
})
