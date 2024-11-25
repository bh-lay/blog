<style lang="stylus" rel="stylesheet/stylus">
@import "./common/stylus/variable.styl"
@import './common/stylus/article.styl'
@import './common/stylus/hightlight.styl'

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
.view-page
	position relative
	min-height 100vh
	background #21272c

</style>
<template>
	<div id="app">
		<Navigation/>
		<router-view class="view-page" />
	</div>
</template>

<script>
import './common/stylus/animation.css'
import Navigation from './components/navigation/index.vue'

export default {
	name: 'App',
	components: {Navigation},
}
</script>
