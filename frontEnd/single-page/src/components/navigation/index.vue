<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.navigation
	position fixed
	width 100%
	height $navigation-height
	top 0
	left 0
	padding-top 20px
	z-index 10000
	transition .6s ease-in-out
	.nav-inner
		display flex
		align-items center
		justify-content space-between
		height $navigation-height
		margin 0 -10px 0 0
		padding 0 10px 0 0
		background #fff
	.nav-logo
		height $navigation-height
		padding 0 18px
		line-height $navigation-height
		background #f4f5f6
		border-left 1px solid transparent
		border-right 1px solid #e9ebed
		svg
			display inline-block
			vertical-align middle
			width 30px
			height 30px
			margin-right 2px
			fill #3d505c
		span
			display inline-block
			vertical-align middle
			line-height 30px
			font-weight bold
			font-size 16px
			color #526a7a
	.nav-list
		a
			position relative
			display inline-block
			width 80px
			line-height $navigation-height
			text-align center
			font-size 14px
			font-weight bold
			color #2d3339
			text-decoration none
			transition .2s
			&:after
				content ''
				position absolute
				bottom 20px
				left 15px
				width 0
				height 1px
				background #007fff
				transition .4s
			&:hover:after
				width 25px
			&.router-link-exact-active
				color #007fff
				&:after
					width 50px
	&.mini
		padding-top 0
		background #fff
		box-shadow 0 0 2px rgba(0,0,0,0.063), 0 0 10px rgba(0,0,0,0.125)
		.nav-logo
			border-left-color #e9ebed
</style>
<template>
	<div
		class="navigation"
		:class="{
			mini: isScrolling
		}"
	>
		<Container>
			<div class="nav-inner">
				<router-link
					to="/"
					class="nav-logo"
				>
					<svg viewBox="150 50 1700 1700" xmlns="http://www.w3.org/2000/svg">
						<path d="m1636.55 1484.58a211.6 211.6 0 0 1 -250.18 54.76 801.031 801.031 0 0 0 -775.466 1.51 211.855 211.855 0 0 1 -247.233-55.97 796.437 796.437 0 0 1 -163.671-484.88c0-441.828 358.172-800 800-800s800 358.172 800 800a796.409 796.409 0 0 1 -163.45 484.58zm-636.55-884.58c-220.914 0-400 179.086-400 400s179.086 400 400 400 400-179.09 400-400-179.09-400-400-400z"/>
					</svg>
					<span>小剧客栈</span>
				</router-link>
				<div class="nav-list">
					<router-link
						v-for="nav in navList"
						:key="nav.type"
						:to="nav.href"
					>{{nav.label}}</router-link>
				</div>
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
