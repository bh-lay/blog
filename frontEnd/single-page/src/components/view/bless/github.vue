<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~@/assets/stylus/variable.styl'
@import '~@/assets/stylus/mixin.styl'


.side-github
	header
		position relative
		height 110px
		background #555
	.logo
		position absolute
		bottom 0
		left 0
		width 100%
		font-size 120px
		color #333
		height 70px
		overflow hidden
		text-align center
		line-height 90px
	.avatar
		position absolute
		bottom -30px
		left 50%
		width 70px
		height 70px
		margin-left -40px
		padding 5px
		border-radius 100%
		background #fff
		img
			display block
			width 70px
			height 70px
			border-radius 100%
	.main
		padding 40px 0 15px
		text-align center
		h3
			font-size 18px
			font-weight normal
			margin-bottom .5em
		i
			margin-right 6px
	.count
		border-top 1px solid #eee
		&:after
			content ''
			display block
			clear both
			height 0
			overflow hidden
		a
			display block
			width 33.333%
			float left
			padding 10px 0
			&:hover
				background #fafafa
		strong,
		span
			display block
			text-align center
			line-height 1.2em
		strong
			font-size 20px
			color #333
		span
			font-size 12px
			color #aaa
</style>
<template>
<div class="side-github">
	<header>
		<div class="logo">
		</div>
		<div class="avatar">
			<img src="//avatars1.githubusercontent.com/u/4100462?v=4">
		</div>
	</header>
	<div class="main">
		<h3>剧中人在Github</h3>
		<p>
			<Button :href="profileURL" type="primary">
				<i class="l-icon l-icon-person"></i>Follow me
			</Button>
		</p>
	</div>
	<div class="count">
		<a :href="profileURL">
			<strong>{{summary.followers}}</strong>
			<span>Followers</span>
		</a>
		<a :href="profileURL">
			<strong>{{summary.public_repos}}</strong>
			<span>Repos</span>
		</a>
		<a :href="profileURL">
			<strong>{{summary.following}}</strong>
			<span>Following</span>
		</a>
	</div>
</div>
</template>

<script>
export default {
	name: 'my-github-summary',
	props: ['summary'],
	data () {
		return {
			profileURL: 'https://github.com/bh-lay'
		}
	},
	created () {},
	methods: {}
}
</script>
