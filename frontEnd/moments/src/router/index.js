import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/view/index/index.vue'
import Post from '@/components/view/post/index.vue'
import Friends from '@/components/view/friends/list.vue'
import FriendDetail from '@/components/view/friends/detail.vue'

Vue.use(Router)

export default new Router({
	// mode: 'history',
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
			path: '/post/',
			name: 'postListIndexPage',
			component: Post,
			meta: {
				keepAlive: true
			}
		},
		{
			path: '/post/page/:page',
			name: 'postListPage',
			component: Post,
			meta: {
				keepAlive: true
			}
		},
		{
			path: '/friends/',
			name: 'friendListIndexPage',
			component: Friends,
			meta: {
				keepAlive: true
			}
		},
		{
			path: '/friends/page/:page',
			name: 'friendListPage',
			component: Friends,
			meta: {
				keepAlive: true
			}
		},
		{
			path: '/friend/:id',
			name: 'friendDetailPage',
			component: FriendDetail,
			meta: {
				keepAlive: true
			}
		}
	],
	scrollBehavior (to, from, savedPosition) {
		return { x: 0, y: 0 }
	}
})
