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
.list-type-switch
	margin-bottom 20px
	padding 15px
	text-align center
	background #fff
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
			<Container>
				<tagList />
				<div class="list-type-switch">
					<Button @click="setPreListType(true)">归档视图</Button>
					<Button @click="setPreListType(false)">瀑布流视图</Button>
				</div>
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
let globalUsePreListMode = false
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
			photoGraphaIndex: globalPhotoGraphaIndex,
			usePreListMode: globalUsePreListMode
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
		setPreListType (isSet) {
			this.usePreListMode = isSet
		}
	},
	beforeDestroy() {
		globalUsePreListMode = this.usePreListMode
	}
}
</script>
