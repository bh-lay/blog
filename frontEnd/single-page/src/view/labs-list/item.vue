<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/variable.styl'
@import '../../common/stylus/mixin.styl'

.post-item
	margin-bottom 20px
	box-shadow 1px 1px 2px rgba(0, 0, 0, .2)
	background #fff
	overflow hidden
	.thumb
		background #eee
		img
			display block
			width 100%
			height 100%
			object-fit cover
	.intro
		.title
			height 30px
			margin-bottom 10px
			line-height 30px
			font-size 16px
			color #000
			white-space nowrap
			overflow hidden
			text-overflow ellipsis
		.desc
			height 80px
			line-height 16px
			font-size 12px
			color #888
			overflow hidden
			display -webkit-box
			-webkit-line-clamp 5
			-webkit-box-orient vertical
			text-overflow ellipsis
	.links
		a
			margin-right 8px
@media screen and (max-width $max-mobile-width)
	.post-item
		.thumb
			aspect-ratio 1.5
		.intro
			padding 20px 15px
		.links
			padding 0 15px 15px
@media screen and (min-width $max-mobile-width)
	.post-item
		display grid
		grid-template-columns 40% 60%
		grid-template-rows 1fr 45px
		grid-column-gap 0
		grid-row-gap 0
	.thumb
		grid-area 1 / 1 / 3 / 2
	.intro
		grid-area 1 / 2 / 2 / 3
		padding 10px 15px
	.links
		grid-area 2 / 2 / 3 / 3
		padding 5px 15px
</style>
<template>
<div class="post-item" :href="post.url" target="_blank">
	<div class="thumb">
		<img v-lazy :src="thumb" />
	</div>
	<div class="intro">
		<div class="title">{{post.title}}</div>
		<div class="desc">{{post.intro}}</div>
	</div>
	<div class="links">
		<Button v-if="post.git_full_name" size="small" :href="`https://github.com/${post.git_full_name}`">
			Github
		</Button>
		<Button v-if="post.demo_url" size="small" type="ghost" :href="post.demo_url">
			Demo
		</Button>
	</div>
</div>
</template>

<script>
import filters from '@/filters/index.js'
export default {
	props: {
		post: {
			type: Object,
			default () {
				return {}
			}
		}
	},
	data () {
		return {
		}
	},
	computed: {
		thumb() {
			return filters.imgHosting(this.post.cover)
		},
	},
	created () {
	},
	methods: {
	}
}
</script>
