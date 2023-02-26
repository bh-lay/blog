/**
 * @author bh-lay
 */
import http from 'http'
import querystring from 'querystring'
import formidable, {errors as formidableErrors} from 'formidable';
import crypto from 'crypto'

// 格式化cookie
export function parseCookie(str: string){
	str = str ||''
	var cookieData: Record<string, string | number> = {}
  
	var list = str.split(';')
  
	for(var i = 0 , t = list.length ; i < t ; i++){
		var parseList = list[i].split('=')
		var nameStr = parseList[0]||''
		var name = nameStr.replace(/^\s+|\s+$/g,'')
		var value = parseList[1]||''
    
		cookieData[name] = value
	}
	return cookieData
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
	var formatObj: Record<timeKey, number> = {
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

/**
 * 格式化GET/POST的数据
 *  弥补querystring.parse的不足（不能解析多维数据）
 *  act=delete&user[id]&school[classA][studentA]=xiaoming
 *
 */
type objectRecord =  Record<string, unknown>
function parserData(input: string): objectRecord{
	if(!input || input.length == 0){
		return {}
	}
	
	// querystring初步解析数据
	var data = querystring.parse(input)
	var obj: objectRecord = {}
	// 遍历各个字段
	for(var key in data){
		var value = data[key]
		// 检测键名是否包含子对象（user[id]）
		var test_key = key.match(/^(.+?)\[/)
		if(!test_key){
			// 不包含子对象，直接赋值
			obj[key] = value
		}else{
			// 包含子对象，拼命解析开始
      
			// 获取最顶层键名，构建对象
			var firstKey = test_key[1]
			obj[firstKey] = obj[firstKey] || {}
      
			var nextObj = obj[firstKey]
			let lastObj: objectRecord = {}
			let lastKey: string = ''
			// 使用正则模拟递归 遍历子对象（school[classA][studentA]）
			key.replace(/\[(.+?)\]/g, function(a: string, b) {
				lastObj = nextObj as objectRecord
				lastKey = b
				lastObj[lastKey] = lastObj[lastKey] || {}
				nextObj = lastObj[lastKey]
				return ''
			})
			// 赋值
			lastObj[lastKey] = value
		}
	}
	return obj
}
/**
 * parse request data
 * callBack(err, fields, files);
 */
export function parseRequestBody(req: http.IncomingMessage): Promise<{params: objectRecord, files?: formidable.Files}> {

	var method = (req['method']||'').toLocaleLowerCase()
	var params = parserData((req.url || '').split('?')[1])

	if(method == 'get'){
		return Promise.resolve({
			params
		})
	}
	// 直接取到的content-type，可能为“application/x-www-form-urlencoded; charset=UTF-8”
	var contentType = req.headers['content-type'] || ''
	// FIXME 猥琐的处理方式
	contentType = contentType.split(';')[0]
	var postData = ''
	if(contentType == 'application/json') {
		// 数据块接收中
		return new Promise((resolve, reject) => {
			req.addListener('data', function (postDataChunk) {
				postData += postDataChunk
			})
			// 数据接收完毕，执行回调函数
			req.addListener('end', function () {
				try {
					var fields_post = JSON.parse(postData)
					// 将URL上的参数非强制性的增加到post数据上
					for(var i in params){
						if(!fields_post[i]){
							fields_post[i] = params[i]
						}
					}
					resolve({
						params: fields_post
					})
				} catch (e) {
					reject(e)
				}
			})
		})
	} else if(contentType == 'application/x-www-form-urlencoded'){
		return new Promise((resolve, reject) => {
			// 数据块接收中
			req.addListener('data', function (postDataChunk) {
				postData += postDataChunk
			})
			// 数据接收完毕，执行回调函数
			req.addListener('end', function () {
				var fields_post = parserData(postData)
				// 将URL上的参数非强制性的增加到post数据上
				for(var i in params){
					if(!fields_post[i]){
						fields_post[i] = params[i]
					}
				}
				resolve({
					params: fields_post
				})
			})
		})
	}
	return new Promise((resolve, reject) => {
		const form = formidable({
			uploadDir: './temporary/upload',
			keepExtensions: true,
		});

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
			resolve({
				params: fields,
				files
			})
    });
	})
}


export type typeParsedUrl = {
	pathname: string,
	search: querystring.ParsedUrlQuery,
	filename: string
}
// parse URL
export function parseURL(url: string): typeParsedUrl{
	url = url||''
	// filter url code '../'
	url = url.replace(/\.\.\//g,'')
  
	var a = url.split(/\?/)
	// 去除首尾的“/”
	var b = a[0].replace(/^\/|\/$/g,'')
	var searchStr = a[1] || ''
	var search = querystring.parse(searchStr)
  
	var obj: typeParsedUrl = {
		pathname: a[0],
		search: search,
		filename: ''
	}
  
	if(obj.pathname.match(/\/\w+\.\w+$/)){
		// obj.pathnode.pop();
		const matches = obj.pathname.match(/\/(\w+\.\w+$)/)
		obj.filename = matches? matches[1] : ''
	}
	return obj
}

export function str2md5(text: string | number) {
	text = text || ''
	if(typeof(text) != 'string'){
		text = text.toString()
	}
	return crypto.createHash('md5').update(text).digest('hex')
}
