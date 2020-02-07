<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
$tag_cnt_bj = #fff
/** 博文列表页 **/
.articleListPage
	min-height 600px
	padding-bottom 20px
	background #dee3e7
	.article-list-header
		height 300px
.articleListPage-tags-ghost
	width 100%
	padding-bottom 20px

.articleListPage-tags
	width 100%
	background $tag_cnt_bj
	border-bottom 1px solid #c4cdd4
	z-index 500
	.content
		padding 12px 0 5px 5px
	a
		position relative
		display inline-block
		max-width 100%
		height 24px
		margin 0 10px 5px 0
		line-height 24px
		padding 0 8px 0 18px
		border-radius 0 4px 4px 0
		background #eee
		font-size 12px
		color #333
		overflow hidden
		text-overflow ellipsis
		white-space nowrap
		span
			opacity .3
			padding 0 0 0 5px
		&:before
			position absolute
			content ''
			top 0
			left 0
			width 0
			height 0
			border-width 12px 12px 12px 0
			border-color $tag_cnt_bj transparent $tag_cnt_bj transparent
			border-style solid
		&:after
			position absolute
			content ''
			width 4px
			height 4px
			top 10px
			left 8px
			border-radius 100%
			background $tag_cnt_bj
		&:hover
			background #333
			color #fff
		&.active
			background #f70
			color #fff

.articleList
	position relative
	margin-bottom 10px

@media (max-width 660px)
	.articleListPage-tags
		position static !important
	.articleList
		margin 0 10px
		width auto
</style>
<template>
<div class="articleListPage">
	<div class="article-list-header">
		<headerBanner
			:photoGraphaList="photoGraphaList"
			:photoGraphaIndex="photoGraphaIndex"
			@nextIndex="nextIndex"
		/>
	</div>
	<Tie
		class="articleListPage-tags-ghost"
		:tie-top="56"
	>
		<div class="articleListPage-tags">
			<Container>
				<tagList />
			</Container>
		</div>
	</Tie>
	<Container>
		<stickList />
	</Container>
	<Footer />
</div>
</template>

<script>
import Stick from 'vue-stick'
import headerBanner from '@/components/header-banner/index.vue'
import stickList from './stick-list.vue'

import tagList from './tag-list.vue'

let globalPhotoGraphaIndex = 0
const prefixBlogList = list => {
	list = list || []

	let now = new Date().getTime()
	list.forEach(item => {
		// 三个月内的博文都算新闻章
		item.is_new = (now - item.time_show) / (1000 * 60 * 60 * 24) < 90
	})

	return list
}
export default {
	name: 'blogPage',
	components: {
		headerBanner,
		tagList,
		stickList,
		Stick: Stick.component
	},
	data () {
		return {
			photoGraphaList: [
				{
					imgSrc: require('../../components/sns-page-layout/images/opus_@2x.jpg'),
					htmlSrc: 'https://bh-lay.tuchong.com/14431809/#image24933177',
					title: '宏村',
					author: '剧中人'
				}, {
					imgSrc: require('../../components/sns-page-layout/images/yangshuo.jpg'),
					htmlSrc: 'http://720yun.com/t/544jOrkvtn0?from=bh-lay',
					title: '桂林阳朔',
					author: '剧中人'
				}
			],
			photoGraphaIndex: globalPhotoGraphaIndex
		}
	},
	computed: {
		tag () {
			return this.$route.query.tag || ''
		}
	},
	methods: {
		nextIndex (index) {
			globalPhotoGraphaIndex = index
		}
	}
}
</script>
