import crypto from 'crypto'

export function base64Encode(str: string) {
	/* eslint-disable-next-line no-undef */
	return Buffer.from(str).toString('base64')
}
export function base64Decode(str: string) {
	/* eslint-disable-next-line no-undef */
	return Buffer.from(str, 'base64').toString()
}

export function encodeHtml (html: string) {
	if (typeof html !== 'string') {
		return html
	}
	/* eslint-disable no-control-regex */
	return html.replace(/<|>/g,function($0){
		let c = $0.charCodeAt(0)
		const r: (string | number)[] = ['&#']
		c = (c === 0x20) ? 0xA0 : c
		r.push(c)
		r.push(';')
		return r.join('')
	})
}


export function str2md5(text: string | number) {
	text = text || ''
	if(typeof(text) != 'string'){
		text = text.toString()
	}
	return crypto.createHash('md5').update(text).digest('hex')
}

/**
 * @param (timestamp/Date,'{y}-{m}-{d} {h}:{i}:{s}')
 * 
 * y:year
 * m:months
 * d:date
 * h:hour
 * i:minutes
 * s:second
 * a:day
 */
export function formatTime(time: Date | string, format: string){

	format = format ||'{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if(typeof(time) === 'object'){
		date = time
	}else{
		date = new Date(parseInt(time))
	}
  type timeKey = 'y' | 'm' | 'd' | 'h' | 'i' | 's' | 'a'
  const formatObj: Record<timeKey, number> = {
  	y : date.getFullYear(),
  	m : date.getMonth() + 1,
  	d : date.getDate(),
  	h : date.getHours(),
  	i : date.getMinutes(),
  	s : date.getSeconds(),
  	a : date.getDay(),
  }
  return format.replace(/{(y|m|d|h|i|s|a)+}/g, function(keyMatched: string, key: string) {
  	const currentKey = key as timeKey
  	const value = formatObj[currentKey]
  	if (keyMatched.length === 4 && value < 10) {
  		return '0' + value
  	}
  	return (value || 0).toString()
  })
}

// 生成ID
export function createID(){
	return parseInt(Math.ceil(Math.random()*1000) + '' + new Date().getTime()).toString(36)
}
