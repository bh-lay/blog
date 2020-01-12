<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.navigation
	position fixed
	width 100%
	height $navigation-height
	top 0
	left 0
	z-index 10000
	background rgba(255, 255, 255, .4)
	transition .6s ease-in-out
	.nav-inner
		display flex
		align-items center
		justify-content space-between
		height 100%
	.nav-list
		a
			display inline-block
			height 20px
			margin-left 20px
			padding 6px 10px
			border-radius 6px
			line-height 20px
			text-align center
			font-size 14px
			font-weight bold
			color #2d3339
			text-decoration none
			transition .2s .1s
			&:hover
				background #668299
				color #fff
			&.router-link-exact-active
				background #0d8bf2
				color #fff
	&.mini
		height $nav-mini-height
		background #fff
		box-shadow 0 0 2px #00000010, 0 0 10px #00000020
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
		<Container class="nav-inner">
			<div class="page-title">H5</div>
			<div class="nav-list">
				<router-link
					v-for="nav in navList"
					:key="nav.type"
					:to="nav.href"
				>
					<span>{{nav.label}}</span>
				</router-link>
			</div>
		</Container>
	</div>
</template>

<script>

export default {
	name: 'navigation',
	data () {
		return {
			isScrolling: false,
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
		}
	}
}
</script>
