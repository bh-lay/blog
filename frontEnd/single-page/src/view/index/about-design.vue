<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
@import "~@/assets/stylus/mixin.styl"

.index-about-design
	position relative
	padding-top 9em
	line-height 1.8em
	text-align center
	background #222
	background-image -webkit-gradient(linear, left top, left bottom, color-stop(0, #222), color-stop(1, #333))
	&:before
		content ''
		position absolute
		width 0
		height 0
		top -50px
		left 0
		border-style solid
		border-width 50px 100vw 0 0
		border-color transparent #222 transparent
	h3
		margin-bottom 1em
		font-size 2em
		font-weight normal
		letter-spacing .2em
		color #fff
	p
		margin-bottom 7em
		padding-right .4em
		font-size 1.3em
		color #ddd
	.links
		font-size 1em
		color #fff
		a
			padding 0 .5em
			text-decoration underline
			color #fff
	.device-cnt
		position relative
		height 176px
		max-width 600px
		margin 2em auto 0
		overflow hidden
		&after
			content ''
			position absolute
			height 10px
			left 10px
			right 10px
			bottom -10px
			box-shadow 0 0 10px #000
	.device
		position absolute
		bottom 0
		border-radius 8px 8px 0 0
		background #aaa
		border-style solid
		border-color #ddd
		border-width 10px 6px 0
		line-height 0
		/** 导航 **/
		&:before
			content ''
			display block
			height 10px
			margin-bottom 6px
			background #fff
			box-shadow 0 2px 2px -2px #000
		/** 列表项 **/
		i
			display inline-block
			position relative
			width 58px
			height 75px
			background #fff
			margin 0 3px 8px
			&:before
				content ''
				position absolute
				width 100%
				height 62%
				left 0
				top 0
				background #eee
	.mobile
		width 52px
		height 88px
		border-width 17px 4px 0
		left 10px
		z-index 1
		&after
			content ''
			display block
			position absolute
			background #555
			width 3px
			height 3px
			top -13px
			left 24px
			border-radius 3px
		span
			display block
			position absolute
			background #555
			width 10px
			height 2px
			top -7px
			left 20px
			border-radius 2px
		i
			display block
			width auto
			height 55px
			margin-bottom 4px
	.pc
		width 280px
		height 166px
		left 50%
		margin-left -146px
		&:before
			margin-bottom 10px
	.pad
		width 105px
		height 113px
		right 10px
		border-top-width 17px
		&after
			content ''
			display block
			position absolute
			background #555
			width 4px
			height 4px
			top -11px
			left 51px
			border-radius 100%
		i
			width 44px
			height 55px
</style>
<template>
<section class="index-about-design">
	<h3>尝试实现响应式设计</h3>
	<p>配合单页架构营造顺滑体验</p>
	<div class="links">
		单页组件<a href="http://bh-lay.github.io/lofox/index.html" target="_blank">lofox.js</a>
		<a href="http://bh-lay.github.io/iframer/app.html" target="_blank">iframer</a>
	</div>
	<div class="device-cnt">
		<div class="device mobile"><span></span><i></i><i></i></div>
		<div class="device pc"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
		<div class="device pad"><i></i><i></i><i></i><i></i></div>
	</div>
</section>
</template>

<script>
export default {
	name: 'index-about-design',
	data () {
		return {
		}
	}
}
</script>
