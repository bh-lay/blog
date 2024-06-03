<style lang="stylus" rel="stylesheet/stylus">
@import "./assets/stylus/variable.styl"
@import './assets/stylus/article.styl'
@import './assets/stylus/hightlight.styl'

html, body, div
	margin 0
	padding 0
body
	font-size 14px
	font-family PingFang SC,Helvetica neue,Helvetica,Tahoma,lantinghei sc,Microsoft Yahei,sans-serif
	-webkit-font-smoothing antialiased
	background #21272c
a
	text-decoration none
html
	--scrollbar-color #c4c9d4;

::-webkit-scrollbar
	width 12px;
	height 12px;
	background-color transparent

::-webkit-scrollbar-track
	background-color transparent

::-webkit-scrollbar-thumb
	background-color #fff0;
	background-clip content-box;
	border-radius 6px;
	border 4px solid transparent

*::-webkit-scrollbar-thumb:hover
	border-width 2px;
	background-color var(--scrollbar-color)
*:hover::-webkit-scrollbar-thumb
	background-color var(--scrollbar-color)

#app
	font-family 'Avenir', Helvetica, Arial, sans-serif
	-webkit-font-smoothing antialiased
	-moz-osx-font-smoothing grayscale
	position relative
.view-outer
	min-height 100vh
.view-page
	position relative
	background #21272c
.view-animate-enter-active
	animation view-in 1.2s ease-in-out
.view-animate-leave-active
	animation view-out 1.2s ease-in-out
	transform-origin center bottom

@keyframes view-in
	0%,
	50%
		opacity 0
		transform translate(0, 200px)
	100%
		opacity 1
		transform translate(0, 0)
@keyframes view-out
	0%
		transform scale(1)
	50%,
	100%
		transform scale(0.88)
.view-page-leave
	position absolute
	top 0px
	left 0px
	z-index 0
	width 100%
	height 100vh
	overflow hidden
@media screen and (max-width $max-mobile-width)
	.view-page-leave
		top $navigation-height
</style>
<template>
	<div id="app">
		<Navigation/>
		<div class="view-outer">
			<transition
				name="view-animate"
				@beforeLeave="beforeLeave"
				@afterLeave="afterLeave"
			>
				<router-view class="view-page" />
			</transition>
		</div>
	</div>
</template>

<script>
import './assets/stylus/animation.css'
import Navigation from './components/navigation/index.vue'
function getScrollTop () {
	return Math.max(document.documentElement.scrollTop, document.body.scrollTop)
}
export default {
	name: 'App',
	components: {Navigation},
	methods: {
		beforeLeave (node) {
			let scrollTop = getScrollTop()
			window.scrollTo(0, 0)
			node.classList.add('view-page-leave')
			node.scrollTop = scrollTop
		},
		afterLeave () {
			// window.scrollTo(0, 0)
		}
	}
}
</script>
