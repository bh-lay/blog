<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.navigation
	height $navigation-height
	background #aaa
.naigation-body
	position fixed
	width 100%
	height $navigation-height
	top 0
	left 0
	background #fff
	box-shadow 0 0 2px #00000010, 0 0 10px #00000020
	z-index 10000
	transition .4s ease-in-out
	.page-container
		display flex
		align-items center
		justify-content space-between
		height 100%
	&.mini
		height 60px
.page-title
	margin-right 50px
	font-size 24px
	color #aaa
.nav-list
	a
		display inline-block
		width 100px
		line-height 50px
</style>
<template>
	<div
		class="navigation"
	>
		<div
			class="naigation-body"
			:class="{
				mini: isScrolling
			}"
		>
			<div class="page-container">
				<div class="page-title">剧中人的朋友圈</div>
				<div class="nav-list">
					<a href="#/">首页</a>
					<a href="#/post/page/1">动态</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'navigation',
	data () {
		return {
			isScrolling: false
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
			this.isScrolling = scrollTop > 200
		}
	}
}
</script>
