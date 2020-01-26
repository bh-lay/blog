<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
@import "~@/assets/stylus/mixin.styl"

.bless-page
	background #fff
	overflow hidden
.bless-header
	height 70vh !important
	min-height 420px !important
	.bless-header-content
		position absolute
		top 20%
		left 0
		width 100%
		height 60%
		display flex
		align-items center
		justify-content center
	.bless-header-main
		width 100%
		max-width 700px
		margin auto
		padding 0 20px
	h2
		height 1em
		line-height 1em
		margin 0 0 0.5em
		text-align center
		font-weight normal
		font-size 3rem
		color #fff
.bless-body
	display flex
	flex-wrap wrap
	.main-body
		width 400px
		flex 1
		flex-basis auto
		overflow auto
		box-sizing border-box
		padding 20px 20px 80px
	.bless-sidebar
		position relative
		width 320px
	.sidebar-body
		box-sizing border-box
		height 100%
		margin-right -300px
		padding 20px 320px 20px 20px
		border-left 1px solid #ebf1f5
		background #f5f8fa
		.side-card
			margin-bottom 20px
			overflow hidden
			background #fff
			border-radius 2px
			box-shadow 0 0 2px rgba(0, 0, 0, 0.2)

@media screen and (max-width $max-pad-width)
	.bless-body
		display block
		.main-body
			width auto
			padding 20px 0 40px
		.bless-sidebar
			width auto
		.sidebar-body
			margin 0
			padding 0
			border none
			background transparent
</style>
<template>
<div class="bless-page">
	<headerBanner
		class="bless-header"
		:photoGraphaList="photoGraphaList"
		:photoGraphaIndex="photoGraphaIndex"
		@nextIndex="nextIndex"
	>
		<div class="bless-header-content">
			<div class="bless-header-main">
				<h2>说点啥</h2>
				<CommentsSendBox
					cid="define-1"
					@sendSuccess="sendSuccess"
				/>
			</div>
		</div>
	</headerBanner>
	<Container class="bless-body">
		<div class="main-body">
			<CommentsList
				cid="define-1"
				ref="commentsList"
			/>
		</div>
		<div class="bless-sidebar">
			<div class="sidebar-body">
				<Github
					class="side-card"
					:summary="githubSummary"
					:isLoading="isLoading"
				/>
				<Comments
					class="side-card"
					:list="commentList"
					:isLoading="isLoading"
				/>
			</div>
		</div>
	</Container>
	<Footer />
</div>
</template>

<script>
import headerBanner from '@/components/header-banner/index.vue'
import CommentsSendBox from '@/components/comments/send-box.vue'
import CommentsList from '@/components/comments/list.vue'
import Github from './github.vue'
import Comments from './comments.vue'

let globalPhotoGraphaIndex = 0

export default {
	name: 'bless-page',
	components: {CommentsSendBox, CommentsList, Comments, Github, headerBanner},
	data () {
		return {
			commentList: [],
			githubSummary: {
				public_repos: 0,
				followers: 0,
				following: 0
			},

			photoGraphaList: [
				{
					imgSrc: require('./images/1.jpg'),
					htmlSrc: 'https://bh-lay.tuchong.com/14431809/#image24933177',
					title: '宏村',
					author: '剧中人'
				}, {
					imgSrc: require('./images/2.jpg'),
					htmlSrc: 'http://720yun.com/t/544jOrkvtn0?from=bh-lay',
					title: '桂林阳朔',
					author: '剧中人'
				}
			],
			photoGraphaIndex: globalPhotoGraphaIndex,
			isLoading: false
		}
	},
	created () {
		this.getSummary()
	},
	methods: {
		sendSuccess () {
			this.$refs.commentsList.refresh()
		},
		getSummary () {
			this.isLoading = true
			fetch('/api/single-page-side')
				.then(response => response.json())
				.then(data => {
					this.githubSummary = data.githubSummary
					this.commentList = data.commentList
				})
				.catch(() => {})
				.then(() => {
					this.isLoading = false
				})
		},
		nextIndex (index) {
			globalPhotoGraphaIndex = index
		}
	}
}
</script>
