<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
@import "~@/assets/stylus/mixin.styl"

.bless-page
	background #fff
	overflow hidden
.bless-header
	position relative
	height 75vh
	min-height 500px
	display flex
	align-content center
	background no-repeat center center #cef
	background-size cover
	h2
		height 1em
		line-height 1em
		margin 0 0 0.5em
		text-align center
		font-weight normal
		font-size 3rem
		color #fff
	photography()
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
.bless-sendBox
	max-width 700px
	width 100%
	margin:auto
@media screen and (max-width: 950px)
	.blessPage .bless-sidebar
		width 100%
		.sidebar-body
			margin-left -800px
			padding-left 820px
</style>
<template>
<div class="bless-page">
	<div class="bless-header" style="background-image: url('${photography.imgSrc}')">
		<Container>
			<h2>说点啥</h2>
			<div class="bless-sendBox">
				<CommentsSendBox
					cid="define-1"
					@sendSuccess="sendSuccess"
				/>
			</div>
		</Container>
		<div class="photograghy-author">
			<a href="${photography.htmlSrc}" target="_blank">${photography.title} By:@剧中人</a>
		</div>
	</div>
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
				/>
				<Comments
					class="side-card"
					:list="commentList"
				/>
			</div>
		</div>
	</Container>
</div>
</template>

<script>
import CommentsSendBox from '@/components/comments/send-box.vue'
import CommentsList from '@/components/comments/list.vue'
import Github from './github.vue'
import Comments from './comments.vue'

export default {
	name: 'bless-page',
	components: {CommentsSendBox, CommentsList, Comments, Github},
	data () {
		return {
			commentList: [],
			githubSummary: {
				public_repos: 0,
				followers: 0,
				following: 0
			}
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
			fetch('/api/single-page-side')
				.then(response => response.json())
				.then(data => {
					this.githubSummary = data.githubSummary
					this.commentList = data.commentList
				})
		}
	}
}
</script>
