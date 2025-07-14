<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/variable.styl"

.blog-detail
	font-size 14px
	background #fff
	header
		position relative
		background no-repeat center
		background-size cover
		.header-body
			position relative
			color #21262c
			.title
				margin-bottom .5em
				line-height 1.2
				font-size 2em
				font-weight 700
			.article-info span
				padding 0 0.5em
				border 1px solid rgba(255, 255, 255, 0.05)
				border-radius 4px
				opacity .9
				box-decoration-break clone
				-webkit-box-decoration-break clone
				background rgba(255, 255, 255, 0.05)
				line-height 2
	.section-article
		position relative
		.caption
			padding 0 20px 2em
			h1
				margin-bottom 1em
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
		.title
			margin-bottom 1.5em
			font-weight 400
			color #52667a
		button
			display block
			margin-bottom 10px
			line-height 1.2em
			text-align left
			font-size 14px
			color #52667a
			transition .2s
			&:hover
				color #407fbf
@media screen and (max-width $pad-portrait-width)
	.blog-detail
		header
			height 50vw
			background-color #eee
		.header-body
			display none
		.section-article
			.section-article-body
				padding 2.5em 0 4em
			.section-article-side
				display none
	.section-comments
		padding 2em 0 4em
		border-top 1px solid #f0f1f5
@media screen and (min-width $pad-portrait-width)
	$page_bj_color = #f0f1f5
	.blog-detail
		background $page_bj_color
		header
			&:before
				content ""
				position absolute
				left 0
				bottom 0
				width 100%
				height 100%
				z-index 0
				pointer-events none
				backdrop-filter blur(8px)
				background-image linear-gradient(
					0deg,
					$page_bj_color,
					transparentify($page_bj_color, 0.5) 300px
				),
				linear-gradient(
					0deg,
					$page_bj_color,
					transparent 100px
				)
			&:after
				content ""
				position absolute
				left 0
				bottom -10px
				width 100%
				height 20px
				z-index 0
				background-image linear-gradient(0deg, transparent, $page_bj_color, transparent)
		.header-body
			min-height 220px
			padding $navigation-height * 2.5 20px 360px
			.article-info
				width 60%
	.section-article
		position relative
		z-index 1
		.container
			display flex
			min-height 1500px
			margin-top -360px
			margin-bottom -80px
		.section-article-body
			width 400px
			flex-shrink 1
			flex-grow 1
			padding 3em 6em 5em 2em
			border-radius 8px
			background #fff
			box-shadow 5px 10px 10px -5px rgba(0, 0, 0, .2)
		.section-article-side
			width 280px
			flex-shrink 0.8
			border-radius 0 18px 18px 0
			margin 30px 0
			padding 38px 15px 40px 30px
			background rgba(255, 255, 255, 0.6)
		.toc-content
			position sticky
			top $navigation-height
			box-sizing border-box
			max-height calc(100vh - 56px)
			overflow auto
	.section-comments
		position relative
		padding 140px 0 50px
		background #5a6872
		z-index 0
		&:before
			content ''
			position absolute
			top -30vh
			left 0
			width 0
			height 0
			margin-left 0
			border-style solid
			border-color transparent transparent #5a6872
			border-width 0 0 30vh 100vw
		.comments
			padding-bottom 20px
			border-radius 12px
			background #fff
			overflow hidden
</style>
<template>
<div class="blog-detail">
	<header :style="{backgroundImage: `url(${coverImgUrl})`}">
		<Container class="header-body">
			<div class="title">{{detail.title}}</div>
			<div class="article-info"><span>{{detail.intro}}</span></div>
		</Container>
	</header>
	<div class="section-article">
		<Container>
			<div class="section-article-body" v-loading="isLoading">
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
			<div class="section-article-side">
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
			</div>
		</Container>
	</div>
	<div class="section-comments">
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
import highlight from '@/common/js/highlight.js'
import Comments from '@/components/comments/index.vue'
import BlogTag from '@/components/common/blog-tag.vue'
import filters from '@/filters/index.js'
import { getLastClickedArticle } from "@/common/view-transition/"
import blogShare from './share.vue'
import buildToc from './build-toc.js'
// 图片预加载
function loadImg (src, callback) {
	if (!src) {
		callback && callback()
		return
	}
	var img = new Image()

	function End () {
		callback && callback()
		callback = null
	}

	img.onerror = img.onload = End
	img.src = src
}

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
			coverImgUrl: '',
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
		this.initFromCache()
		this.initFromApi()
	},
	methods: {
		initFromCache() {
			const lastClickedArticle = getLastClickedArticle()
			if (!lastClickedArticle) {
				return
			}
			if (lastClickedArticle.id !== this.blogID) {
				return
			}
			this.detail = {
				id: lastClickedArticle.id || '',
				title: lastClickedArticle.title || '',
				author: lastClickedArticle.author || '',
				content: `<p>${lastClickedArticle.intro || ''}</p>`,
				cover: lastClickedArticle.cover || '',
				intro: lastClickedArticle.intro || '',
				tags: lastClickedArticle.tags || [],
				time_show: lastClickedArticle.time_show || ''
			}
			this.coverImgUrl = filters.imgHosting(lastClickedArticle.cover, 'zoom', 420)
		},
		initFromApi() {
			this.isLoading = true
			fetch(`/api/blog/${this.blogID}?format=html`)
				.then(response => response.json())
				.then(data => {
					if (data.code === 2) {
						this.$router.replace({
							path: '/blog/',
						})
						return
					}
					for (let key in this.detail) {
						this.detail[key] = data.detail[key]
					}

					// 构建大纲数据
					let tocData = buildToc(data.detail.content)
					this.detail.content = tocData.article
					this.articleToc = tocData.toc

					// 渲染顶部图片
					let coverUrl = filters.imgHosting(data.detail.cover, 'zoom', 420)
					loadImg(coverUrl, () => {
						this.coverImgUrl = coverUrl
					})
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
