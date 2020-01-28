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
		position relative
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
		background #0d9af2
		svg
			display inline-block
			vertical-align middle
			width 25px
			height 25px
			margin-right 2px
			fill #fff
		span
			display inline-block
			vertical-align middle
			line-height 30px
			font-weight bold
			font-size 14px
			color #fff
	.nav-more-btn
		display none
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
				bottom 15px
				left 18%
				width 0
				height 1px
				background #007fff
				transition .4s
			&:hover:after
				width 30%
			&.router-link-exact-active
				color #007fff
				&:after
					width 64%
	&.mini
		padding-top 0
		background #fff
		box-shadow 0 0 2px rgba(0,0,0,0.063), 0 0 10px rgba(0,0,0,0.125)
@media screen and (max-width 750px)
	.navigation .nav-list a
		width 60px
		font-size 13px
@media screen and (max-width $max-mobile-width)
	.navigation
		.nav-list-body
			position absolute
			top 70px
			right 0
			width 200px
			background #fff
			box-shadow 2px 2px 10px rgba(0,0,0,0.1), 1px 1px 2px rgba(0,0,0,0.2)
			transition .2s ease-in-out
			visibility hidden
			opacity 0
		.nav-list
			a
				display block
				width 100%
		.nav-mask
			position fixed
			top 0
			left 0
			width 100%
			height 100%
			background rgba(0, 0, 0, .2)
			transition .2s ease-in-out
			visibility hidden
			opacity 0
		.nav-more-btn
			position absolute
			display block
			width 44px
			height 44px
			top 10px
			right 10px
			border none
			cursor default
			background #fff
			i
				display block
				position absolute
				width 26px
				height 4px
				left 9px
				border-radius 4px
				background #444
				transition .2s ease-in-out
				&:nth-child(1)
					top 10px
				&:nth-child(2)
					top 19px
				&:nth-child(3)
					top 28px
	.nav-slidedown
		.nav-more-btn
			i:nth-child(1)
				transform translateY(9px) rotate(-45deg)
			i:nth-child(2)
				opacity: 0
			i:nth-child(3)
				transform translateY(-9px) rotate(45deg)
		.nav-list-body
		.nav-mask
			visibility visible
			opacity 1
</style>
<template>
	<div
		class="navigation"
		:class="{
			mini: isScrolling,
			'nav-slidedown': navSlidedown
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
					<Button class="nav-more-btn" @click="navSlidedown = !navSlidedown"><i></i><i></i><i></i></Button>
					<div class="nav-mask" @click="navSlidedown = false"></div>
					<div class="nav-list-body">
						<router-link
							v-for="nav in navList"
							:key="nav.type"
							:to="nav.href"
						>{{nav.label}}</router-link>
					</div>
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
			],
			navSlidedown: false
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
	},
	watch: {
		$route () {
			this.navSlidedown = false
		}
	}
}
</script>
