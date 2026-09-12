// 跳转链接生成
export function createRedirectUrl (url: string): string {
	return '//bh-lay.com/r/' + btoa(encodeURIComponent(url))
}

function ensureProtocol (url: string): string {
	if (!url || url.startsWith('http://') || url.startsWith('https://')) {
		return url
	}
	return 'http://' + url
}

export function createExternalSiteUrl (url: string): string {
	const urlWithProtocol = ensureProtocol(url)
	return createRedirectUrl(urlWithProtocol)
}
