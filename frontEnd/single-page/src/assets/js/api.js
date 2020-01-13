let domain = '/api'
// 获取
export function getApiData (url = '') {
	return fetch(domain + url.replace(/^\b(\/)*/, '/'), {
		method: 'GET',
		mode: 'cors'
	})
		.then(response => response.json())
}
