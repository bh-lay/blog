<style lang="stylus" rel="stylesheet/stylus" scoped>
.post-list
	padding 0 40px 50px
.item
	display flex
	margin-bottom 20px
	padding 20px
	border-bottom: 1px solid #ddd
	.user
		width 60px
		height 60px
		margin-right 20px
		border-radius 4px
		background center center no-repeat #444
		background-size cover
	.main
		flex-grow 1
		width 200px;
		min-height 200px
		.caption
			.friend-name
				font-weight bold
				text-decoration none
				font-size 18px
				color #333
				transition  .3s ease-in-out
				&:hover
					text-decoration underline
					color #f24a0d
		.cover
			display block
			max-width 100%
			background #333
		.title
			padding 10px 0
			font-size 24px
		.content
			padding 20px 0
			font-size 15px
</style>
<template>
	<div class="post-list">
		<div
			class="item"
			v-for="(item, index) in postList"
			:key="index"
		>
			<div
				class="user"
				:style="{
					backgroundImage: `url(${item.user.avatar})`
				}"
			>
			</div>
			<div class="main">
				<div class="caption">
					<a href="#" class="friend-name">{{item.user.title}}</a>
					<span> 发布于 </span>
					<span class="time">{{item.createTime | timeFormat}}</span>
				</div>
				<div class="title">{{item.title}}</div>
				<div class="tags-area">{{item.tags}}</div>
				<img
					class="cover"
					v-if="item.cover"
					:src="item.cover"
					:alt="item.title"
				>
				<div class="content article" v-html="item.content" ></div>
				<a :href="item.originalUrl">阅读原文</a>
			</div>
		</div>
		<pagination
			v-if="!disablePagination"
			:total="pageInfo.total"
			:size="pageInfo.size"
			:current.sync="pageInfo.current"
		/>
	</div>
</template>

<script>
import pagination from '../pagination/index.vue'
export default {
	name: 'post-list',
	props: ['disablePagination', 'firstPage'],
	components: {pagination},
	data () {
		return {
			postList: [],
			pageInfo: {
				total: 0,
				current: 1,
				size: 10
			}
		}
	},
	created () {
		this.pageInfo.current = parseInt(this.firstPage || 1, 10)
		this.getData()
	},
	methods: {
		getData () {
			let skip = (this.pageInfo.current - 1) * this.pageInfo.size
			let limit = this.pageInfo.size
			fetch(`/api/moment/post/?skip=${skip}&limit=${limit}`, {
				method: 'GET'
			})
				.then(response => response.json())
				.then(({count, list}) => {
					this.postList = list
					this.pageInfo.total = count
				})
		}
	},
	watch: {
		'pageInfo.current' () {
			this.getData()
		}
	}
}
</script>
