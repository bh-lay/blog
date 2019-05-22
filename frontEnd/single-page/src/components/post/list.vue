<style lang="stylus" rel="stylesheet/stylus" scoped>
.post-list
	padding 0 20px 50px 30px
.item
	display flex
	margin-bottom 20px
	padding 20px
	border-bottom: 1px solid #e7eaef
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
			height 24px
			line-height 24px
			a
				font-weight bold
				text-decoration none
				font-size 18px
				color #2270bf
				transition  .2s ease-in-out
				&:hover
					text-decoration underline
					color #198ae6
			span
				padding 0 10px 0 20px
				font-size 14px
				color #737f8c
			strong
				font-weight normal
				font-size 15px
				color #667f99
				cursor default
		.title
			padding 15px 0
			line-height 30px
			font-weight 500
			font-size 26px
		.tags-area
			margin-bottom 20px
			svg
				display inline-block
				vertical-align middle
				width 20px
				fill #667f99
			strong
				display inline-block
				vertical-align middle
				margin-right 14px
				font-weight normal
				font-size 14px
				color #667f99
			a
				display inline-block
				vertical-align middle
				height 20px
				margin-right 10px
				padding 0 8px
				background #2270bf
				border-radius 4px
				line-height 20px
				text-decoration none
				font-size 12px
				color #fff
				transition .2s
				&:hover
					background #23578b
					color #c9d8e8
		.cover
			display block
			max-width 100%
			margin-bottom 20px
			background #333
		.content
			padding 0 0 20px
			font-size 15px
		.read-more
			display inline-block
			padding 10px 25px
			text-decoration none
			color #667f99
			border-radius 4px
			border 1px solid #e0e5eb
			transition .2s
			svg
				display inline-block
				vertical-align middle
				height 16px
				margin-right 7px
				fill currentColor
			span
				display inline-block
				vertical-align middle
				height 18px
				line-height 18px
				font-size 13px
			&:hover
				border-color #667f99
</style>
<template>
	<div class="post-list">
		<template v-if="postList.length === 0">
			<slot name="empty-tips" v-if="$slots['empty-tips']"></slot>
			<div v-else>暂无推文</div>
		</template>
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
					<router-link
						:to="'/friend/' + item.user.id"
					>{{item.user.title}}</router-link>
					<span>发布于</span>
					<strong :title="item.createTime | timeFormat">{{item.createTime | dateDiff}}</strong>
				</div>
				<div class="title">{{item.title}}</div>
				<div class="tags-area">
					<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
						<path d="M900.64 379.808l-263.072-256.032c-36.448-35.328-105.76-35.392-142.304 0.096l-327.04 319.904c-56.416 54.72-70.72 76.704-70.72 150.976l0 143.936c0 132.768 26.976 192 186.912 192l131.872 0c81.12 0 128.448-46.656 193.952-111.264l290.016-297.696c18.592-17.984 29.248-43.968 29.248-71.264C929.504 423.36 918.976 397.6 900.64 379.808zM323.008 786.752c-52.928 0-96-43.072-96-96s43.072-96 96-96 96 43.072 96 96S375.936 786.752 323.008 786.752z" />
					</svg>
					<strong>标签</strong>
					<router-link
						v-for="tag in item.tags"
						:key="tag"
						:to="'/post/?tag=' + tag"
					>{{tag}}</router-link>
				</div>
				<img
					class="cover"
					v-if="item.cover"
					:src="item.cover"
					:alt="item.title"
				>
				<div class="content article" v-html="item.content" ></div>
				<a
					:href="item.originalUrl | urlPrefix"
					target="_blank"
					class="read-more"
				>
					<svg viewBox="0 0 1038 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
						<path d="M860.598617 1022.400915l141.300989-37.845018c25.585364-6.880912 40.84936-32.999305 33.823076-59.359983L797.458977 36.104504c-6.929369-25.924564-33.677705-41.285474-58.923869-34.501476l-141.300989 37.845018c-25.633821 6.880912-40.84936 32.999305-33.823076 59.359983l238.215248 889.091409C808.604117 1013.824003 835.303995 1029.136456 860.598617 1022.400915z" />
						<path d="M194.264631 1020.801829C220.770681 1020.801829 242.285647 999.480693 242.285647 972.199329L242.285647 51.756157c0-26.84525-21.854165-48.554044-48.021015-48.554044L48.021015 3.202114C21.514965 3.202114 0 24.474793 0 51.756157l0 920.443172c0 26.84525 21.854165 48.554044 48.021015 48.554044L194.264631 1020.753372z" />
						<path d="M485.007407 1020.801829c26.50605 0 48.021015-21.27268 48.021015-48.554044L533.028423 51.756157c0-26.84525-21.854165-48.554044-48.021015-48.554044L338.763791 3.202114C312.257741 3.202114 290.742776 24.474793 290.742776 51.756157l0 920.443172c0 26.84525 21.854165 48.554044 48.021015 48.554044L485.007407 1020.753372z" />
					</svg>
					<span>阅读原文</span>
				</a>
			</div>
		</div>
		<pagination
			v-if="!disablePagination"
			:total="pageInfo.total"
			:size="pageInfo.size"
			:current="pageIndex"
			@page-change="handlePageChange"
		/>
	</div>
</template>

<script>
import pagination from '../pagination/index.vue'
import {getApiData} from '@/assets/js/api.js'

export default {
	name: 'post-list',
	props: ['disablePagination', 'pageIndex', 'tag', 'friendID'],
	components: {pagination},
	data () {
		return {
			postList: [],
			pageInfo: {
				total: 0,
				size: 10
			},
			timer: null
		}
	},
	created () {
		this.getData()
	},
	methods: {
		getData () {
			clearTimeout(this.timer)
			this.timer = setTimeout(() => {
				this.forceGetData()
			}, 50)
		},
		forceGetData () {
			let skip = ((this.pageIndex || 1) - 1) * this.pageInfo.size
			let limit = this.pageInfo.size
			let apiUrl = `/moment/post/?skip=${skip}&limit=${limit}`
			if (this.tag) {
				apiUrl += `&tag=${this.tag}`
			}
			if (this.friendID) {
				apiUrl += `&userid=${this.friendID}`
			}
			getApiData(apiUrl)
				.then(({count, list}) => {
					this.postList = list
					this.pageInfo.total = count
				})
		},
		handlePageChange (index) {
			this.$emit('update:pageIndex', index)
		}
	},
	watch: {
		pageIndex () {
			this.getData()
		},
		tag () {
			this.getData()
		}
	}
}
</script>
