
// 跳转链接生成
export function createRedirectUrl (url) {
	return '//bh-lay.com/r/' + btoa(encodeURIComponent(url))
}

function ensureProtocol(url) {
	if (!url || url.startsWith('http://') || url.startsWith('https://')) {
		return url;
	}
	return 'http://' + url;
}
export function createExternalSiteUrl (url) {
	const urlWithProtocol = ensureProtocol(url);
	return createRedirectUrl(urlWithProtocol);
}
