<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../assets/stylus/variable.styl"

.blog-detail
	font-size 14px
	background #fff
	overflow-x hidden
	header
		position relative
		min-height 300px
		background no-repeat center #1f3747
		background-image -webkit-linear-gradient(left, #1f3747 0%, #293d31 100%)
		background-size cover
		.header-body
			padding $navigation-height * 2.2 20px $navigation-height
			.title
				margin-bottom .5em
				line-height 1.2
				font-size 2em
				font-weight 500
				color #fff
			.article-info
				width 62%
				margin-bottom 3em
				color #fff
				opacity .8
	.article-section
		display flex
		.article-section-body
			flex-grow 1
			width 200px
			padding 5em 6em 5em 1em
		.article-section-side
			display flex
			width 340px
			border-left 1px solid #edeff3
			.article-section-body
				margin-right -300px
				padding 30px 320px 20px 20px
				background #f9fafb
		.caption
			padding 0 20px
			h1
				margin-bottom .4em
				font-size 28px
			.publish-time
				display flex
				width 230px
				border-radius 4px
				overflow hidden
				background #edf0f2
				font-size 14px
				.label
					display flex
					width 85px
					background #2691d9
					justify-content center
					align-items center
					font-weight bold
					font-size 14px
					color #fff
				.main
					flex-grow 1
					padding 5px 0 5px 15px
				.date-relative
					font-weight bold
					font-size 16px
					color #454e54
				.date-real
					font-size 12px
					color #8f9ba3
		.article
			font-size 16px
			color #22272a
		footer
			margin 0 20px
			p
				word-break break-all
				line-height: 24px
				font-size 14px
				color #5c6870
		.sns-share
			margin 0 20px
	.toc-content
		width 280px
		padding 20px 10px 40px
		.title
			margin-bottom 10px
			line-height 2em
			font-size 15px
			color #c2ccd6
		button
			display block
			margin-bottom 10px
			line-height 1.2em
			text-align left
			font-size 14px
			color #667f99
			transition .2s
			&:hover
				color #407fbf
	.comments-section
		position relative
		padding 2em 0 4em
		background #5a6872
		&:before
			position absolute
			content ''
			top -15px
			left 50%
			margin-left -30px
			width 0
			height 0
			border-style solid
			border-color transparent transparent #5a6872
			border-width 0 30px 15px
@media screen and (max-width $pad-portrait-width)
	.blog-detail .article-section .article-section-body
		padding 5em 2em 5em 0
@media screen and (max-width $pad-landscape-width)
	.blog-detail
		padding 0
		.article-section
			.article-section-body
				padding 1em 0
			.article-section-side
				display none
		.comments-section
			padding 2em 0
	.header-body
		display none
		position relative
		padding 2em 0 4em
		background #5a6872
		&:before
			position absolute
			content ''
			top -15px
			left 50%
			margin-left -30px
			width 0
			height 0
			border-style solid
			border-color transparent transparent #5a6872
			border-width 0 30px 15px
</style>
<template>
<div class="blog-detail" v-loading="isLoading">
	<header ref="header">
		<Container class="header-body">
			<div class="title">{{detail.title}}</div>
			<div class="article-info"><span>{{detail.intro}}</span></div>
		</Container>
	</header>
	<Container>
		<div class="article-section">
			<div class="article-section-body">
				<div class="caption">
					<h1>{{detail.title}}</h1>
					<div class="publish-time">
						<div class="label">发布时间</div>
						<div class="main">
							<div class="date-relative">{{detail.time_show | dateDiff}}</div>
							<div class="date-real">{{detail.time_show | timeFormat}}</div>
						</div>
					</div>
				</div>
				<div class="article" ref="article" v-html="detail.content"></div>
				<footer>
					<p><strong>tags：</strong>
						<blog-tag
							v-for="(tag, index) in detail.tags"
							:key="index"
							:tag="tag"
						/>
					</p>
					<p><strong>转载请注明来源：</strong>{{ blogUrl }}</p>
				</footer>

				<blogShare
					v-if="!isLoading"
					:shared-url="blogUrl"
					:title="detail.title"
					:intro="detail.intro"
					:cover="detail.cover"
				/>
			</div>
			<div class="article-section-side">
				<div class="article-section-body">
					<Tie :tieTop="60">
						<div class="toc-content" ref="tieNode">
							<div class="title">TOC</div>
							<Button
								type="text"
								v-for="item in articleToc"
								:key="item.id"
								:style="{
									paddingLeft: `${item.indent}em`
								}"
								@click="scrollTo(item.id)"
							>{{item.text}}</Button>
						</div>
					</Tie>
				</div>
			</div>
		</div>
	</Container>
	<div class="comments-section">
		<Container>
			<Comments
				:cid="'blog-' + blogID"
			/>
		</Container>
	</div>
	<Footer />
</div>
</template>
<script>
import highlight from '@/assets/js/highlight.js'
import Comments from '@/components/comments/index.vue'
import BlogTag from '@/components/common/blog-tag.vue'
import filters from '@/filters/index.js'
import blogShare from './share.vue'
import buildToc from './build-toc.js'
import renderBanner from './render-banner.js'

export default {
	name: 'blogDetail',
	components: {
		Comments,
		blogShare,
		BlogTag
	},
	data () {
		return {
			detail: {
				id: '',
				title: '',
				author: '',
				content: '',
				cover: '',
				intro: '',
				tags: [],
				time_show: ''
			},
			articleToc: [],

			isLoading: true
		}
	},
	computed: {
		blogID () {
			return this.$route.params.id || ''
		},
		blogUrl () {
			return `${location.origin}/blog/${this.detail.id}`
		}
	},
	mounted () {
		this.init()
	},
	methods: {
		init () {
			this.isLoading = true
			fetch(`/api/blog/${this.blogID}?format=html`)
				.then(response => response.json())
				.then(data => {
					for (let key in this.detail) {
						this.detail[key] = data.detail[key]
					}

					// 构建大纲数据
					let tocData = buildToc(data.detail.content)
					this.detail.content = tocData.article
					this.articleToc = tocData.toc

					// 渲染顶部图片
					renderBanner(this.$refs.header, data.detail.cover)
					this.$nextTick(() => this.addCodeSupport())
				})
				.catch(() => {})
				.then(() => {
					this.isLoading = false

					let coverUrl = filters.imgHosting(this.detail.cover, 'cover', 420)
					this.setTitle(this.detail.title, this.detail.intro, coverUrl)
				})
		},
		addCodeSupport () {
			// 代码高亮
			let codeList = this.$refs.article.querySelectorAll('pre code')
			codeList.forEach(codeNode => highlight(codeNode))
		},
		scrollTo (id) {
			// 绑定 toc 点击事件
			let node = document.querySelector('[data-id="' + id + '"]')
			if (!node) {
				return
			}
			node.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'nearest'
			})
		}
	}
}
</script>
