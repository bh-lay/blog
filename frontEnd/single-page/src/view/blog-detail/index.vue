<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"

// @import "../../../../_public/less/_articleGithub.less"

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
			p
				font-size 14px
		.article
			background #fff
		footer
			margin 0 20px 40px
			padding 10px 20px
			background #f7f8f8
			p
				font-size 14px
				color #5c6870
			a
				margin-right 10px
				font-size 14px
				color #5c6870
				&:hover
					text-decoration underline
	.toc-content
		width 300px
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
			color #8599ad
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
@media screen and (max-width $max-pad-width)
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
					<p>发布时间：<span>{{detail.time_show | timeFormat}}</span></p>
				</div>
				<div class="article" ref="article" v-html="detail.content"></div>
				<footer>
					<p><strong>tags：</strong>
					<router-link
						v-for="(tag, index) in detail.tags"
						:key="tag + index"
						:to="'/blog?tag=' + tag"
					>{{tag}}</router-link>
					</p>
					<p><strong>转载请注明来源：</strong>http://bh-lay.com/blog/{{detail.id}}</p>

					<blogShare
						v-if="!isLoading"
						:blogID="detail.id"
						:title="detail.title"
						:intro="detail.intro"
						:cover="detail.cover"
					/>
				</footer>
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
import blogShare from './share.vue'
import buildToc from './build-toc.js'
import renderBanner from './render-banner.js'

export default {
	name: 'blogDetail',
	components: {
		Comments,
		blogShare
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
