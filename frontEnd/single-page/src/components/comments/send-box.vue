<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.comments-send-box
	display flex
	padding 20px
	background #fff
	.side
		margin-right 20px
		.cover
			width 40px
			height 40px
			border-radius 8px
			background #333
	.main
		flex-grow 1
		.input-content
			position relative
			margin-bottom 15px
			border 1px solid #ddd
			&:before
				content ""
				position absolute
				display block
				width 14px
				height 14px
				top 14px
				left -7px
				border 1px solid #ddd
				border-width 0 0 1px 1px
				background #fff
				transform rotate(45deg)
		.placeholder
			box-sizing border-box
			position absolute
			width 100%
			height 100%
			top 0
			left 0
			padding 15px 20px
			line-height 20px
			font-size 1rem
			color #a6a6a6
			cursor text
			background #fff
			small
				font-size 13px
				color #ddd
		textarea
			box-sizing border-box
			display block
			width 100%
			padding 4px 10px
			margin 0
			border none
			resize none
			font-family inherit
			line-height 24px
			font-size 1rem
			color #333
			&:focus
				outline none
				border-color #fa0
</style>
<template>
<div class="comments-send-box">
	<div class="side">
		<div class="cover"></div>
	</div>
	<div class="main">
		<div class="input-content">
			<textarea name="" id="" cols="30" rows="3"></textarea>
			<div class="placeholder">评论屌一点，BUG少一点 ！<br><small>支持 Markdown 哦 ！</small></div>
		</div>
		<div class="footer">
			<Button type="primary">发布</Button>
		</div>
	</div>
</div>
</template>
<script>

export default {
	name: 'comments-send-box',
	components: {
	},
	data () {
		return {
		}
	},
	computed: {
	},
	mounted () {
	},
	methods: {
	}
}
</script>
