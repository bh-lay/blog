import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/view/index/index.vue'
import Post from '@/components/view/post.vue'

Vue.use(Router)

export default new Router({
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
			path: '/post/page/:page',
			name: 'post',
			component: Post,
			meta: {
				keepAlive: true
			}
		}
	],
	scrollBehavior (to, from, savedPosition) {
		return { x: 0, y: 0 }
	}
})
