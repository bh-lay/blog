const baseTitle = '小剧客栈-剧中人的个人博客！'
let globalTitle = baseTitle

export function setTitle (title) {
	// 会变的 title
	globalTitle = `${title} | ${baseTitle}`
	document.title = globalTitle
}

export default {
	install (Vue) {
		Vue.setTitle = Vue.prototype.setTitle = setTitle
	}
}
