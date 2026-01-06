/**
 * 毫秒格式化
 */
function timeFormat (time, format = '{y}-{mm}-{dd} {hh}:{ii}') {
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

	let timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (a, b) => {
		const value = formatObj[b] || 0
		if (a.length >= 4 && value < 10) {
			return '0' + value
		}
		return value
	})
	return timeStr
}

export default { timeFormat }
