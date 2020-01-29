import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/view/index/index.vue'
import BlogList from '@/view/blog-list/index.vue'
import BlogDetail from '@/view/blog-detail/index.vue'

import LabsList from '@/view/labs-list/index.vue'
import PanoList from '@/view/pano-list/index.vue'
import PhotographyList from '@/view/photography-list/index.vue'
import Bless from '@/view/bless/index.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
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
	]
})
