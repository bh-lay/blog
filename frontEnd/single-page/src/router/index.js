import Vue from 'vue'
import Router from 'vue-router'
import { beforeRouterChange } from "@/common/view-transition/"
import Index from '@/view/index/index.vue'
import BlogList from '@/view/blog-list/index.vue'
import BlogDetail from '@/view/blog-detail/index.vue'

import LabsList from '@/view/labs-list/index.vue'
import PanoList from '@/view/pano-list/index.vue'
import PhotographyList from '@/view/photography-list/index.vue'
import Bless from '@/view/bless/index.vue'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'index',
			component: Index,
			meta: {
				title: '首页'
			}
		},
		{
			path: '/blog/',
			name: 'blogListPage',
			component: BlogList,
			meta: {
				title: '博文'
			}
		},
		{
			path: '/blog/:id',
			name: 'blogDetail',
			component: BlogDetail,
			meta: {
				title: '加载中...'
			}
		},
		{
			path: '/labs/',
			name: 'labs',
			component: LabsList,
			meta: {
				title: '实验室'
			}
		},
		{
			path: '/720/',
			name: 'pano',
			component: PanoList,
			meta: {
				title: '全景摄影'
			}
		},
		{
			path: '/photography/',
			name: 'photography',
			component: PhotographyList,
			meta: {
				title: '摄影'
			}
		},
		{
			path: '/bless/',
			name: 'blessPage',
			component: Bless,
			meta: {
				title: '留言板'
			}
		}
	]
})

router.beforeEach(beforeRouterChange)

export default router