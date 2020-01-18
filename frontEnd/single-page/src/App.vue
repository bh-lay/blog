<style lang="stylus" rel="stylesheet/stylus">
@import './assets/stylus/article.styl'
html, body, div
	margin 0
	padding 0
body
	font-size 14px
	font-family PingFang SC,Helvetica neue,Helvetica,Tahoma,lantinghei sc,Microsoft Yahei,sans-serif
	-webkit-font-smoothing antialiased
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
	background #333

.view-animate-enter-active
	will-change transform opacity
	transition all 1.2s .5s
.view-animate-leave-active
	will-change transform opacity
	transition all .5s
.view-animate-enter
	opacity 0
	transform translate(-15%, 0)
.view-animate-leave-active
	opacity 0
	transform translate(30%, 0)

.page-footer
	height 400px
	background #333
</style>
<template>
	<div id="app">
		<Navigation/>
		<div class="view-outer">
			<transition name="view-animate" >
				<router-view class="view-page" />
			</transition>
		</div>
		<div class="page-footer">

		</div>
	</div>
</template>

<script>
import './assets/stylus/animation.css'
import Navigation from './components/navigation/index.vue'

export default {
	name: 'App',
	components: {Navigation}
}
</script>
