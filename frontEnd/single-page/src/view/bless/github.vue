<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/variable.styl'
@import '../../common/stylus/mixin.styl'


.side-github
	header
		position relative
		height 110px
		background #29353d
	.logo
		position absolute
		bottom 0
		left 31%
		width 38%
		height 76px
		overflow hidden
		text-align center
		svg
			width 100%
			fill #1f282e
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
<div class="side-github" v-loading="isLoading">
	<header>
		<div class="logo">
			<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<path d="M787.696941 669.515294c0 44.935529-23.431529 118.181647-78.787765 118.181647-55.416471 0-78.848-73.246118-78.848-118.181647 0-44.875294 23.431529-118.181647 78.848-118.181647 55.356235 0 78.787765 73.306353 78.787765 118.181647zM315.090824 551.333647c-55.356235 0-78.787765 73.306353-78.787765 118.181647 0 44.935529 23.431529 118.181647 78.787765 118.181647s78.787765-73.246118 78.787764-118.181647c0-44.875294-23.431529-118.181647-78.787764-118.181647zM1024 561.212235c0 68.367059-6.746353 140.950588-37.526588 203.715765-81.257412 164.321882-304.609882 180.284235-464.594824 180.284235-162.454588 0-399.36-14.095059-483.689412-180.284235C6.746353 702.765176 0 629.579294 0 561.212235c0-89.871059 24.636235-174.742588 83.727059-243.651764a338.160941 338.160941 0 0 1-16.624941-104.688942c0-46.140235 10.420706-92.220235 31.382588-134.144 97.219765 0 159.382588 42.465882 233.231059 100.291765a823.536941 823.536941 0 0 1 190.162823-21.504c57.825882 0 116.314353 6.204235 172.333177 19.696941 73.246118-57.223529 135.348706-98.484706 231.363764-98.484706 20.961882 41.863529 31.382588 88.003765 31.382589 134.144 0 35.117176-5.541647 70.174118-16.624942 103.424C999.424 385.807059 1024 471.341176 1024 561.212235z m-137.878588 108.303059c0-94.147765-57.163294-177.212235-157.515294-177.212235-40.598588 0-79.329882 7.408941-119.988706 12.950588-31.984941 4.939294-63.969882 6.746353-96.617412 6.746353s-64.632471-1.807059-96.617412-6.746353c-39.996235-5.541647-79.390118-12.950588-119.988706-12.950588-100.291765 0-157.515294 83.064471-157.515294 177.212235 0 188.295529 172.272941 217.208471 322.43953 217.208471h103.424c150.166588 0.060235 322.379294-28.912941 322.379294-217.208471z"></path>
			</svg>
		</div>
		<div class="avatar">
			<img v-lazy data-v-27dd2652="" src="https://assets-eu.mofei.life/gravatar/d7f43fef201a8c9bce3d550aefc03ebe?s=100">
		</div>
	</header>
	<div class="main">
		<h3>剧中人在Github</h3>
		<p>
			<Button :href="profileURL" type="primary" size="small">
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
	props: ['summary', 'isLoading'],
	data () {
		return {
			profileURL: 'https://github.com/bh-lay'
		}
	},
	created () {},
	methods: {}
}
</script>
