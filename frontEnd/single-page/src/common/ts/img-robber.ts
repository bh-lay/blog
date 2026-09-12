export function imgRobber (imgUrl: string, fakePageUrl?: string): string {
	const imageRootDomain = fakePageUrl ? fakePageUrl : imgUrl.replace(/^(http(?:|s):\/\/)(?:[^/]+\.|)([^/]+\.[^/]+)\/.+$/, '$1$2')
	return '//bh-lay.com/img-robber/' + btoa(imgUrl + '-' + imageRootDomain)
}
