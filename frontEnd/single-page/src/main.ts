import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Footer from './components/footer/index.vue'
import UILibrary from './ui-library'
import funny from './common/ts/funny'

// 处理页面 title 响应
funny.init()

router.beforeEach((to) => {
	funny.setTitle(to.meta.title as string)
})

createApp(App)
	.use(router)
	.use(UILibrary)
	.component('Footer', Footer)
	.mount('#app')

// 为保证页面展示稳定，loading 强制显示至少一秒钟
;(function () {
	const node = document.querySelector('.app-mask')
	const timing = ((window.performance || {}) as any).timing || {}
	const blankTime = timing.domLoading ? new Date().getTime() - timing.domLoading : 500
	const loadingRemoveDelay = 1000 - blankTime
	if (!node) {
		return
	}
	setTimeout(() => {
		node.classList.add('hide')
		setTimeout(() => {
			node.parentNode?.removeChild(node)
		}, 1000)
	}, loadingRemoveDelay)
})()
