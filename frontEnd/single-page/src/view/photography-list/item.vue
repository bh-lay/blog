<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../assets/stylus/variable.styl'
@import '../../assets/stylus/mixin.styl'
.potography-item
	position relative
	.potography-info
		position absolute
		top 0
		left 0
		width 100%
		height 100%
		background rgba(0, 0, 0, .6)
		opacity 0
		transition .3s
		.title
			padding 10px 15px
			font-size 16px
			color #fff
	&:hover
		.potography-info
			opacity 1
</style>
<template>
<div
	class="potography-item"
	:style="{
		aspectRatio: printImage.width/printImage.height,
		backgroundImage: `url(${printImageUrl})`
	}"
>
	<a class="potography-info" :href="post.url" target="_blank">
		<div class="title">{{post.title}}</div>
		<div class="desc">{{post.intro}}</div>
	</a>
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
		printImage() {
			return (this.post?.images || [])[0] || {}
		},
		printImageUrl() {
			return this.printImage.source?.l || ''
		},
		
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
