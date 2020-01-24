<style lang="stylus" rel="stylesheet/stylus">
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
#app
	font-family 'Avenir', Helvetica, Arial, sans-serif
	-webkit-font-smoothing antialiased
	-moz-osx-font-smoothing grayscale

	position relative
.view-outer
	min-height 100vh
	overflow hidden
	background #21272c

.view-animate-enter-active
	will-change transform opacity
	transition all 1s .5s ease-in-out
.view-animate-leave-active
	will-change transform opacity
	transition all .5s ease-in-out
.view-animate-enter
	opacity 0
	transform translate(0, 100px)
.view-animate-leave-active
	opacity 0
	transform scale(0.9)
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
			node.style.position = 'relative'
			node.style.height = '100vh'
			node.style.overflow = 'hidden'
			node.scrollTop = scrollTop
		},
		afterLeave () {
			// window.scrollTo(0, 0)
		}
	}
}
</script>
