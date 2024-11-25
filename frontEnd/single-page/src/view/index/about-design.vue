<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"

.index-about-design
	position relative
	padding-top 9em
	line-height 1.8em
	text-align center
	background #1f2738
	&:before
		content ''
		position absolute
		width 0
		height 0
		top -50px
		left 0
		border-style solid
		border-width 50px 100vw 0 0
		border-color transparent #1f2738 transparent
	h3
		margin-bottom 1em
		font-size 2em
		font-weight normal
		letter-spacing .2em
		color #c1c8d7
	p
		margin-bottom 7em
		padding-right .4em
		font-size 1.3em
		color #a5aec0
	.links
		font-size 1em
		color #a5aec0
		a
			padding 0 .5em
			text-decoration underline
			color #a5aec0
	.device-cnt
		position relative
		height 190px
		max-width 600px
		margin 2em auto 0
		overflow hidden
		&:after
			content ''
			position absolute
			height 10px
			left 10px
			right 10px
			bottom -10px
			box-shadow 0 0 10px rgba(0, 0, 0, .5)
	.device
		position absolute
		bottom 0
		border-radius 8px 8px 0 0
		background #afb8ca
		border-style solid
		border-color #e0e4eb
		border-width 10px 6px 0
		line-height 0
		box-shadow 0px 0px 4px rgba(0, 0, 0,0.2), 1px 1px 2px rgba(0, 0, 0,.4)
		/** 导航 **/
		&:before
			content ''
			display block
			height 10px
			margin-bottom 6px
			background #fff
			box-shadow 0 2px 2px -2px #364463
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
		height 176px
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
	<h3>多视图 + 响应式设计</h3>
	<p>配合单页架构营造顺滑体验</p>
	<div class="links">
		单页组件<a href="https://bh-lay.github.io/lofox/index.html" target="_blank">lofox.js</a>
		<a href="https://bh-lay.github.io/iframer/app.html" target="_blank">iframer</a>
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
