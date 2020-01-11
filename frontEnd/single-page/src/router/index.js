import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/view/index/index.vue'
import BlogList from '@/components/view/blog-list/index.vue'
import BlogDetail from '@/components/view/blog-detail/index.vue'

import Labs from '@/components/view/labs/index.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
	// base: '/moments/',
	routes: [
		{
			path: '/',
			name: 'index',
			component: Index
		},
		{
			path: '/blog/',
			name: 'blogListPage',
			component: BlogList
		},
		{
			path: '/blog/:id',
			name: 'blogListPage',
			component: BlogDetail
		},
		{
			path: '/labs/',
			name: 'labs',
			component: Labs
		}
	],
	scrollBehavior (to, from, savedPosition) {
		return { x: 0, y: 0 }
	}
})
