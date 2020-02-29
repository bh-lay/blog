// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import filters from './filters/index.js'
import Footer from './components/footer/index.vue'
import UILibrary from './ui-library/index.js'
import funny from './assets/js/funny.js'

Vue.use(filters)
Vue.use(UILibrary)
Vue.component('Footer', Footer)
Vue.config.productionTip = false

// 处理页面 title 响应
funny.init()
Vue.prototype.setTitle = funny.setTitle
router.beforeEach((to, from, next) => {
	let title = to.meta.title
	funny.setTitle(title)
	next()
})
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
})

// 为保证页面展示稳定，loading 强制显示至少一秒钟
!(function () {
	let node = document.querySelector('.app-mask')
	let domLoading = ((window.performance || {}).timing || {}).domLoading
	let blankTime = domLoading ? (new Date().getTime() - domLoading) : 500
	let loadingRemoveDelay = 1000 - blankTime
	setTimeout(() => {
		node.classList.add('hide')
		setTimeout(() => {
			node.parentNode.removeChild(node)
		}, 1000)
	}, loadingRemoveDelay)
})()
