<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.l-com-item
	display flex
	margin-bottom 30px
	cursor default
	transition 0.1s
	.avatar
		width 50px
		height 50px
		margin-right 20px
		border-radius 8px
		overflow hidden
		background #ddd
		img
			width  100%
			height 100%
	.content
		position relative
		width 200px
		flex-grow 1
		background #fff
		border-radius 2px
		box-shadow 0 0 2px rgba(0, 0, 0, 0.2)
		&:before
			content ''
			position absolute
			display block
			width 14px
			height 14px
			top 14px
			left -8px
			border 1px solid #ddd
			border-width 0 0 1px 1px
			background #fff
			transform rotate(45deg)
	.caption
		display flex
		height 20px
		padding 15px 20px
		border-bottom 1px solid #eee
		font-size .85rem
		line-height 20px
		.info
			flex-grow 1
			width 100px
			.who
				font-weight 500
			.time
				color #aaa
		.btn-reply
			color #aaa
			&:hover
				color #333
	.article
		min-height 20px
		padding 1.5rem
		font-size .85rem
		pre
			background #f8f8f8
			padding 20px 30px
			color #222
</style>
<template>
<div class="comments-send-box">
	<div
		class="l-com-item"
		v-for="item in list"
		:key="item.id"
	>
		<div class="avatar">
			<img :src="item.user.avatar" />
		</div>
		<div class="content">
			<div class="caption">
				<div class="info">
						<span class="who">
							<a :href="item.user.blog" v-if="item.user.blog">{{item.user.username}</a>
							<span v-else>{{item.user.username}}</span>
						</span>
						<span>评论于</span>
						<span class="time">{{item.time}}</span>
				</div>
				<a href="javascript:void(0)" class="btn-reply">回复</a>
			</div>
			<div class="article" v-html="item.content"></div>
		</div>
	</div>
</div>
</template>
<script>
let defaultAvatar = require('./default.jpg')

export default {
	name: 'comments-list',
	components: {
	},
	props: {
		cid: {
			type: String,
			required: true
		}
	},
	data () {
		return {
			list: []
		}
	},
	computed: {
	},
	mounted () {
		this.getList()
	},
	methods: {
		getList () {
			fetch(`/api/comments/?cid=${this.cid}&skip=0&limit=10`)
				.then(response => response.json())
				.then(data => {
					// data.data.list.forEach(function (item) {
					// 	// 若无头像，使用默认头像
					// 	item.user.avatar = item.user.avatar || defaultAvatar;
					// });
					this.list = data.data.list
				})
		}
	}
}
</script>
