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
	.status
		height 52px
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

.article-item
	margin-bottom 10px
	overflow hidden
	background #fff
	transition box-shadow .3s ease-out
	transition-delay .1s
	.link
		display block
		text-decoration none
	.title
		display block
		padding 1em .5em .2em
		font-weight normal
		line-height 1.5em
		text-align center
		font-size 18px
		color #000
		outline none
	img
		display block
		background #eee
		max-width 100%
		margin auto
	.info
		padding 10px 20px
		line-height 1.4
		font-size 13px
		color #888
		text-indent 2em
	.label
		position absolute
		top 0
		right 0
		width 30px
		height 30px
		background #f70
		box-shadow -1px 1px 2px #000
		&:before
			position absolute
			content ''
			width 0
			height 0
			top 0
			right 0
			border 1px solid #fff
			border-width 0 30px 30px 0
			border-color transparent transparent #fff transparent
		span
			position absolute
			display block
			top 0
			right 0
			width 100%
			height 100%
			-webkit-transform rotate(45deg) scale(.8)
			transform rotate(45deg) scale(.8)
			text-align center
			line-height 15px
			color #fff
	footer
		display flex
		justify-content space-between
		padding 10px
		border-top 1px solid #e8e8e8
		background #fbfbfb
		.tags
			font-size 13px
			strong
				margin-right 5px
				color #aaa
				font-weight normal
			a
				display inline-block
				margin-right 5px
				color #777
				text-decoration none
				&:hover
					text-decoration underline
					color #000
		.time
			white-space nowrap
			color #888
			font-size 12px
	&.pure-text
		.link
			background url("./blog-card.jpg") no-repeat top right #fff
			background-size 170px 34px
	&:hover
		box-shadow 5px 10px 10px -5px rgba(0, 0, 0, .2)

@media (max-width 660px)
	.articleListPage-tags
		position static !important

	.articleListPage .status,
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
		<Stick
			:list="list"
			imgKey="cover"
			@onScrollEnd="loadMore"
		>
			<template slot-scope="scope">
				<div :class="['article-item', !scope.data.cover ? 'pure-text' : '']">
					<router-link
						:to="'/blog/'+ scope.data.id"
						:title="scope.data.title" class="link"
					>
						<div class="label" v-if="scope.data.is_new"><span>new</span></div>
						<img v-if="scope.data.cover" :src="scope.data.cover | imgHosting('zoom', 400)" :alt="scope.data.title" />
						<div class="title">{{scope.data.title}}</div>
						<div class="info"><p>{{scope.data.intro}}</p></div>
					</router-link>
					<footer>
						<div class="tags">
							<strong>tags</strong>
							<router-link
								v-for="(tag, index) in scope.data.tags"
								:key="index"
								:to="'/blog?tag=' + tag"
								:title="scope.data.title"
							>{{tag}}</router-link>
						</div>
						<div class="time" :title="scope.data.time_show | timeFormat">{{scope.data.time_show | dateDiff}}</div>
					</footer>
				</div>
			</template>
		</Stick>
		<div class="status"></div>
	</Container>
	<Footer />
</div>
</template>

<script>
import Stick from 'vue-stick'
import headerBanner from '@/components/header-banner/index.vue'
import tagList from './tag-list.vue'

let globalPhotoGraphaIndex = 0

export default {
	name: 'blogPage',
	components: {
		headerBanner,
		tagList,
		Stick: Stick.component
	},
	data () {
		return {
			page: {
				skip: 0,
				tag: '',
				limit: 20,
				count: Infinity
			},
			list: [],

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
	mounted () {
		this.loadMore()
	},
	methods: {
		refresh () {
			this.page.skip = 0
			this.list = []
			this.loadMore()
		},
		loadMore () {
			if (this.page.skip >= this.page.count) {
				return
			}
			fetch(`/api/blog?skip=${this.page.skip}&limit=${this.page.limit}&tag=${this.tag}`, {
				method: 'GET'
			})
				.then(response => response.json())
				.then(data => {
					this.page.count = data.count
					this.page.skip += this.page.limit
					this.list = this.list.concat(data.list)
				})
				// FIXMEs
			// 		if (err || !data || data.code === 200) {
			// 			// do something
			// 			return
			// 		}
			// 		let count = data['count']
			// 		let list = data['list']
			// 		let now = new Date().getTime()
			// 		for (var i in list) {
			// 			// 三月内的文章都算最新（多可悲）
			// 			if ((now - list[i].time_show) / (1000 * 60 * 60 * 24) < 90) {
			// 				list[i].is_new = true
			// 			}
			// 			list[i].time_show = utils.parseTime(list[i].time_show, '{mm}-{dd} {y}')
			// 			// 使用七牛图床
			// 			list[i].cover = imageHosting(list[i].cover, {
			// 				type: 'zoom',
			// 				width: 420,
			// 			})
			// 		}
			// 		me.count = count
			// 		me.skip += me.limit
			// 		me.onLoaded && me.onLoaded(list, count)
			// 		me.isLoading = false
			// 	}
		},

		nextIndex (index) {
			globalPhotoGraphaIndex = index
		}
	},
	watch: {
		$route () {
			this.refresh()
		}
	}
}
</script>
