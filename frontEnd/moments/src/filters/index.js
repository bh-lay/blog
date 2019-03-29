import Vue from 'vue'

/**
 * 毫秒格式化
 */
Vue.filter('timeFormat', (time, format = '{y}-{m}-{d} {h}:{i}:{s}') => {
	let date = new Date(parseInt(time, 10))
	var formatObj = {
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
