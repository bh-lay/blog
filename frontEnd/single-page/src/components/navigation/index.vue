<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.navigation
	position fixed
	width 100%
	height $navigation-height
	top 0
	left 0
	z-index 10000
	background: #ffffffb3
	transition .6s ease-in-out
	.page-container
		display flex
		align-items center
		justify-content space-between
		height 100%
	.nav-list
		a
			display inline-block
			width 100px
			line-height $nav-mini-height
			text-align center
			text-shadow 1px 1px 1px #ffffff33,2px 2px 5px #ffffff26
			font-size 16px
			font-weight bold
			color #22252a
			text-decoration none
			transition .2s
			&:hover
			&.active
				color #0a66c2
				text-shadow 1px 1px 1px #0f4c8a80
	&.mini
		height $nav-mini-height
		background #fff
		box-shadow 0 0 2px #00000010, 0 0 10px #00000020
		.nav-list a
			text-shadow none
			color #8f99a3
			&.active
				color #0a66c2
.page-title
	margin-right 50px
	font-size 24px
	color #eee
</style>
<template>
	<div
		class="navigation"
		:class="{
			mini: isScrolling
		}"
	>
		<div class="page-container">
			<div class="page-title">H5</div>
			<div class="nav-list">
				<router-link
					v-for="nav in navList"
					:key="nav.type"
					:to="nav.href"
					:class="{
						active: nav.type === currentNavType
					}"
				>
					<span>{{nav.label}}</span>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'navigation',
	data () {
		return {
			isScrolling: false,
			currentNavType: 'index',
			navList: [
				{
					label: '首页',
					href: '/',
					type: 'index'
				},
				{
					label: '博文',
					href: '/blog',
					type: 'blog'
				},
				{
					label: '实验室',
					href: '/labs/',
					type: 'labs'
				},
				{
					label: '全景',
					href: '/720/',
					type: '720'
				},
				{
					label: '摄影',
					href: '/photography',
					type: 'photography'
				},
				{
					label: '留言',
					href: '/bless',
					type: 'bless'
				}
			]
		}
	},
	mounted () {
		this.setActiveNav()
		this.ajustNavigation()
		window.addEventListener('scroll', this.scrollListener)
	},
	beforeDestroy () {
		window.removeEventListener('scroll', this.scrollListener)
	},
	methods: {
		scrollListener () {
			this.ajustNavigation()
		},
		ajustNavigation () {
			let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
			this.isScrolling = scrollTop > 50
		},
		setActiveNav () {
			console.log('route', this.$route)
			let currentRouteName = this.$route.name
			if (currentRouteName === 'index') {
				this.currentNavType = 'index'
			} else if (currentRouteName === 'postListPage' || currentRouteName === 'postListIndexPage') {
				this.currentNavType = 'post'
			} else if (currentRouteName === 'friendListPage' || currentRouteName === 'friendListIndexPage' || currentRouteName === 'friendDetailPage') {
				this.currentNavType = 'friend'
			} else {
				this.currentNavType = ''
			}
		}
	},
	watch: {
		'$route' (route) {
			this.setActiveNav()
		}
	}
}
</script>
