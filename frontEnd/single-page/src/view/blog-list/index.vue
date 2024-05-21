<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../assets/stylus/variable.styl"
$tag_cnt_bj = #fff
/** 博文列表页 **/
.article-list-page
	min-height 600px
	padding-bottom 20px
	background #dee3e7
	.article-list-header
		height 300px
.sticky-bar
	position sticky
	top $navigation-height
	width 100%
	background $tag_cnt_bj
	border-bottom 1px solid #c4cdd4
	z-index 500
.sticky-body
	display flex
	align-items start
	padding 12px 0
	.tag-list
		flex-grow 1
		width 200px
		margin-right 10px
.list-type-switch
	position relative
	width 30px
	background #f1f3f4
	i
		position absolute
		width 8px
		height 8px
		background #bec6ca
		transition .2s
		&:nth-child(1)
			top 5px
			left 5px
		&:nth-child(2)
			top 5px
			left 15px
		&:nth-child(3)
			top 15px
			left 5px
		&:nth-child(4)
			top 15px
			left 15px
	&.active
		i
			width 18px
			height 3px
			left 5px
			&:nth-child(1)
				top 6px
			&:nth-child(4)
				top 12px
			&:nth-child(3)
				top 18px
			&:nth-child(2)
				left 15px
				width 0
				height 0
@media (max-width: $max-mobile-width)
	.sticky-body
		padding 7px 0
</style>
<template>
<div class="article-list-page">
	<div class="article-list-header">
		<headerBanner
			:photoGraphaList="photoGraphaList"
			:photoGraphaIndex="photoGraphaIndex"
			@nextIndex="nextIndex"
		/>
	</div>
	<div class="sticky-bar">
		<Container class="sticky-body">
			<tagList />
			<Button
				size="small"
				@click="toggleArchivesList"
				:class="['list-type-switch', useListMode ? 'active' : '']"
			>
				<i></i><i></i><i></i><i></i>
			</Button>
		</Container>
	</div>
	<Container>
		<archivesList v-if="useListMode"/>
		<stickList v-else/>
	</Container>
	<Footer />
</div>
</template>

<script>
import headerBanner from '@/components/header-banner/index.vue'
import stickList from './stick-list.vue'
import archivesList from './archives-list.vue'
import tagList from './tag-list.vue'
import image1 from './images/architecture-b3.jpg'
import image2 from './images/architecture-b3-2.jpg'

let globalPhotoGraphaIndex = 0

export default {
	name: 'blogPage',
	components: {
		headerBanner,
		tagList,
		stickList,
		archivesList
	},
	data () {
		return {
			photoGraphaList: [
				{
					imgSrc: image1,
					htmlSrc: 'https://bh-lay.tuchong.com/27040825/?from=bh-lay',
					title: '讯飞数据中心',
					author: '剧中人'
				}, {
					imgSrc: image2,
					htmlSrc: 'https://bh-lay.tuchong.com/27040825/?from=bh-lay',
					title: '讯飞数据中心',
					author: '剧中人'
				}
			],
			photoGraphaIndex: globalPhotoGraphaIndex,
			useListMode: localStorage.getItem('blog-layout') === 'list'
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
		},
		toggleArchivesList () {
			this.useListMode = !this.useListMode
			localStorage.setItem('blog-layout', this.useListMode ? 'list' : 'card')
		}
	}
}
</script>
