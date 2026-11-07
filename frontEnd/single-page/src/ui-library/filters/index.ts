/**
 * 毫秒格式化
 */
export function timeFormat (time: number | string, format = '{y}-{mm}-{dd} {hh}:{ii}'): string {
	const date = new Date(parseInt(String(time), 10))
	const formatObj: Record<string, number> = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}

	const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (a, b) => {
		const value = formatObj[b] || 0
		if (a.length >= 4 && value < 10) {
			return '0' + value
		}
		return String(value)
	})
	return timeStr
}

export default { timeFormat }
