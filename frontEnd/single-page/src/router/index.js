import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/view/index/index.vue'
import BlogList from '@/components/view/blog-list/index.vue'
import BlogDetail from '@/components/view/blog-detail/index.vue'

import LabsList from '@/components/view/labs-list/index.vue'
import PanoList from '@/components/view/pano-list/index.vue'
import PhotographyList from '@/components/view/photography-list/index.vue'
import Bless from '@/components/view/bless/index.vue'

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
			name: 'blogDetailPage',
			component: BlogDetail
		},
		{
			path: '/labs/',
			name: 'labs',
			component: LabsList
		},
		{
			path: '/720/',
			name: 'pano',
			component: PanoList
		},
		{
			path: '/photography/',
			name: 'photography',
			component: PhotographyList
		},
		{
			path: '/bless/',
			name: 'blessPage',
			component: Bless
		}
	],
	scrollBehavior (to, from, savedPosition) {
		return { x: 0, y: 0 }
	}
})
