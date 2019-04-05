<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
$nav-mini-height = 60px
.navigation
	position fixed
	width 100%
	height $navigation-height
	top 0
	left 0
	background #fff
	box-shadow 0 0 2px #00000010, 0 0 10px #00000020
	z-index 10000
	transition .6s ease-in-out
	.page-container
		display flex
		align-items center
		justify-content space-between
		height 100%
	&.mini
		height $nav-mini-height
.page-title
	margin-right 50px
	font-size 24px
	color #eee
.nav-list
	a
		display inline-block
		width 100px
		line-height $nav-mini-height
		text-align center
		font-size 16px
		color #8f99a3
		text-decoration none
		transition .2s
		&:hover
			color #0a66c2
		&.active
			font-weight bold
			color #0a66c2
</style>
<template>
	<div
		class="navigation"
		:class="{
			mini: isScrolling
		}"
	>
		<div class="page-container">
			<div class="page-title">剧中人的朋友圈</div>
			<div class="nav-list">
				<router-link
					v-for="nav in navList"
					:key="nav.type"
					:to="nav.href"
					:class="{
						active: nav.type === currentNavType
					}"
				>{{nav.label}}</router-link>
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
					label: '好友',
					href: '/friends/',
					type: 'friend'
				},
				{
					label: '动态',
					href: '/post/',
					type: 'post'
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
			this.isScrolling = scrollTop > 350
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
