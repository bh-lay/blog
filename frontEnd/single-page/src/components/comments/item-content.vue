<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import "../../assets/stylus/variable.styl"
	.content
		position relative
		width 200px
		flex-grow 1
		border 1px solid #dfe7ec
		background #fff
		border-radius 2px
		&:before
			content ''
			position absolute
			display block
			width 14px
			height 14px
			top 14px
			left -8px
			border 1px solid #dfe7ec
			border-width 0 0 1px 1px
			background #fff
			transform rotate(45deg)
	.caption
		display flex
		padding 15px 20px
		font-size 14px
		line-height 20px
		.info
			flex-grow 1
			width 100px
			.who
				font-weight 500
				color #364249
			.time
				color #aaa
				small
					padding-left 5px
		.btn-reply
			color #aaa
			&:hover
				color #333
	.article
		min-height 20px
		padding 20px
		font-size 14px
		pre
			background #f8f8f8
			padding 20px 30px
			color #222
	.send-box
		border-top 1px solid #dfe7ec
		background #f1f3f4
@media screen and (max-width $max-mobile-width)
	.content:before
		width 10px
		height 10px
		top 10px
		left -6px
	.caption
		padding 8px 12px
		.info .who
			display block
	.article
		padding 15px
</style>
<template>
<div class="content">
	<div class="caption">
		<div class="info">
				<a class="who" :href="item.user.blog" v-if="item.user.blog">{{item.user.username}}</a>
				<span v-else class="who">{{item.user.username}}</span>
				<span class="time">评论于<small>{{item.time | timeFormat}}</small></span>
		</div>
		<Button type="text" class="btn-reply" @click="replyMode = !replyMode">回复</Button>
	</div>
	<div class="article" v-html="item.content"></div>
	<SendBox
		v-if="replyMode"
		class="send-box"
		:cid="cid"
		:replyForID="item._id"
		:replyForUsername="item.user.username"
		@sendSuccess="sendSuccess"
	/>
</div>
</template>
<script>
import SendBox from './send-box.vue'
import {defaultAvatar} from './data.js'

export default {
	name: 'comments-list',
	components: {
		SendBox
	},
	props: {
		item: {
			type: Object
		},
		cid: {
			type: String,
			required: true
		}
	},
	data () {
		return {
			replyMode: false
		}
	},
	computed: {
	},
	mounted () {
	},
	watch: {
	},
	methods: {
		sendSuccess () {
			this.replyMode = false
			this.$emit('replySuccess')
		}
	}
}
</script>
