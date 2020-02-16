<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.comments-list
	min-height 400px
.list-empty
	padding 20px
	background #fff
	p
		font-size 14px
		color #8599ad
	h3
		font-size 18px
		color #5c6870
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

@media screen and (max-width $max-mobile-width)
	.l-com-item
		margin-bottom 15px
		.avatar
			width 35px
			height 35px
			margin-right 12px
</style>
<template>
<div class="comments-list" v-loading="isLoading">
	<div ref="scrollMark"></div>
	<div class="list-empty">
		<p>竟然还没有人说过话，好机会来了！</p>
		<h3>写个牛逼哄哄的评论，好么？</h3>
	</div>
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
