<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
$tag_cnt_bj = #fff
/** 博文列表页 **/
.article-list-page
	min-height 600px
	padding-bottom 20px
	background #dee3e7
	.article-list-header
		height 300px
.sticky-bar-outer
	width 100%
	padding-bottom 20px
.sticky-bar
	width 100%
	background $tag_cnt_bj
	border-bottom 1px solid #c4cdd4
	z-index 500
.sticky-body
	display flex
	align-items start
	padding 12px 0 6px
	.tag-list
		flex-grow 1
		width 200px
		margin-right 15px
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
	<Tie
		class="sticky-bar-outer"
		:tie-top="56"
	>
		<div class="sticky-bar">
			<Container class="sticky-body">
				<tagList />
				<Button
					size="small"
					@click="toggleArchivesList"
					:class="['list-type-switch', usePreListMode ? 'active' : '']"
				>
					<i></i><i></i><i></i><i></i>
				</Button>
			</Container>
		</div>
	</Tie>
	<Container>
		<archivesList v-if="usePreListMode"/>
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
		},
		usePreListMode () {
			return this.$route.query.type === 'list'
		}
	},
	methods: {
		nextIndex (index) {
			globalPhotoGraphaIndex = index
		},
		toggleArchivesList () {
			let isSet = !this.usePreListMode
			let query = {}
			if (isSet) {
				query.type = 'list'
				query.page = 1
			}
			if (this.tag) {
				query.tag = this.tag
			}
			this.$router.replace({
				path: '/blog/',
				query
			})
		}
	}
}
</script>
