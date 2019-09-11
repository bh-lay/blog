import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/view/index/index.vue'
import Blog from '@/components/view/blog/index.vue'
import Labs from '@/components/view/labs/index.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
	// base: '/moments/',
	routes: [
		{
			path: '/',
			name: 'index',
			component: Index,
			meta: {
				keepAlive: true
			}
		},
		{
			path: '/blog/',
			name: 'blogListPage',
			component: Blog,
			meta: {
				keepAlive: true
			}
		},
		{
			path: '/labs/',
			name: 'labs',
			component: Labs,
			meta: {
				keepAlive: true
			}
		}
	],
	scrollBehavior (to, from, savedPosition) {
		return { x: 0, y: 0 }
	}
})
