<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../assets/stylus/variable.styl"
@import "../../assets/stylus/mixin.styl"
.comments
	.caption
		padding .5em 1em
		box-shadow 0 0 2px #aaa
		height 24px
		line-height 24px
		font-weight bold
		font-size 15px
		color #414f58
	.content
		min-height 200px
.side-comments-item
	display flex
	padding 10px
	border-top 1px solid #eee
	.cover
		width 50px
		img
			display block
			width 40px
			height 40px
			border-radius 100%
			background #eee
	.main
		flex-grow 1
		width 200px
		h4
			margin 0
			padding 0
			font-size 14px
			font-weight 500
			color #414f58
			small
				opacity .7
				font-weight normal
		p
			margin 0
			padding .5em 0 0
			font-size 12px
			color #888
			word-break break-word
			line-height 1.4em
			max-height 4.2em
			overflow hidden
	&:hover
		background #fafafa
		color inherit
	&.router-link-exact-active
		cursor default
</style>
<template>
<div class="comments">
	<div class="caption">最新评论</div>
	<div class="content" v-loading="isLoading">
		<router-link
			v-for="item in list"
			:key="item._id"
			:to="item.url"
			class="side-comments-item"
		>
			<div class="cover">
				<img :src="item.user.avatar || defaultAvatar" >
			</div>
			<div class="main">
				<h4>{{item.user.username}}<small>0:21 1-21</small></h4>
				<p>{{item.content}}</p>
			</div>
		</router-link>
	</div>
</div>
</template>

<script>
import CommentsSendBox from '@/components/comments/send-box.vue'
import CommentsList from '@/components/comments/list.vue'
import {defaultAvatar} from '@/components/comments/data.js'
export default {
	name: 'latest-comments',
	props: ['list', 'isLoading'],
	data () {
		return {
			defaultAvatar
		}
	},
	created () {
	},
	methods: {
	}
}
</script>
