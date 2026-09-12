const domain = '/api'

// 获取
export function getApiData (url = ''): Promise<any> {
	return fetch(domain + url.replace(/^\b(\/)*/, '/'), {
		method: 'GET',
		mode: 'cors'
	})
		.then(response => response.json())
}
