<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
@import "~@/assets/stylus/mixin.styl"

.index-about-friends
	padding 4em 0
	background #27a3ca
	background-image -webkit-gradient(linear, left top, right bottom, color-stop(.5, #2a97e4), color-stop(1, #21b3ac))
	a
		display block
		width 320px
		height 100px
		margin auto
		background #eee
		box-shadow 2px 2px 4px -2px rgba(0, 0, 0, .4), 0 0 10px rgba(0, 0, 0, .2)
		text-align center
		transition .4s
		&:hover
			box-shadow 2px 2px 10px rgba(0, 0, 0, .4)
			background #fff
	strong
		display block
		padding-top 20px
		line-height 30px
		font-size 22px
		font-weight normal
		color #333
	span
		display block
		line-height 30px
		font-size 14px
		color #555
</style>
<template>
<section class="index-about-friends">
	<a href="/directories" target="_blank">
		<strong>前端英雄榜</strong>
		<span>汇聚小剧身边的小伙伴</span>
	</a>
</section>
</template>

<script>
export default {
	name: 'index-about-friends',
	data () {
		return {
		}
	},
	created () {
	},
	methods: {
	}
}
</script>
