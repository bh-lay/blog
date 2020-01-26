<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.comments-list
	min-height 400px
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
<div class="comments-list" v-loading="isLoading">
	<div ref="scrollMark"></div>
	<div
		class="l-com-item"
		v-for="item in list"
		:key="item._id"
	>
		<div class="avatar">
			<img :src="item.user.avatar" />
		</div>
		<ItemContent
			:cid="cid"
			:item="item"
			@replySuccess="refresh"
		/>
	</div>
	<Pagination
		:total="page.total"
		:size="page.pageItemCount"
		:current.sync="page.pageIndex"
	/>
</div>
</template>
<script>
import ItemContent from './item-content.vue'
import {defaultAvatar} from './data.js'

export default {
	name: 'comments-list',
	components: {
		ItemContent
	},
	props: {
		cid: {
			type: String,
			required: true
		}
	},
	data () {
		return {
			page: {
				total: 0,
				pageItemCount: 15,
				pageIndex: 1
			},
			list: [],
			getListTimer: null,

			replyMode: false,
			isLoading: false
		}
	},
	computed: {
	},
	mounted () {
		this.getList()
	},
	watch: {
		'page.pageIndex' () {
			this.$refs.scrollMark.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'nearest'
			})
			this.getList()
		}
	},
	methods: {
		getList () {
			this.isLoading = true
			clearTimeout(this.getListTimer)
			this.getListTimer = setTimeout(() => {
				this.forceGetList()
					.then(() => {
						this.isLoading = false
					})
			})
		},
		forceGetList () {
			let skip = (this.page.pageIndex - 1) * this.page.pageItemCount
			return fetch(`/api/comments/?cid=${this.cid}&skip=${skip}&limit=${this.page.pageItemCount}`)
				.then(response => response.json())
				.then(data => {
					data.data.list.forEach(function (item) {
						// 若无头像，使用默认头像
						item.user.avatar = item.user.avatar || defaultAvatar
					})
					this.page.total = data.data.count
					this.list = data.data.list
				})
				.catch(() => {})
		},
		refresh () {
			this.page.pageIndex = 1
			this.getList()
		}
	}
}
</script>
