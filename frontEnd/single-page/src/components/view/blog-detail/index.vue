<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"

// @import "../../../../_public/less/_articleGithub.less"

.blog-detail
	font-size 1rem
	background #fff
	overflow-x hidden
	header
		min-height 160px
		max-height 360px
		position relative
		background-color #eee
		background-size cover
		background-position center
		&.no-cover
			background #1f3747
			background-image -webkit-linear-gradient(left, #1f3747 0%, #293d31 100%)
		.header-body
			padding 110px 20px 80px
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
				font-size 1.8rem
			p
				font-size 14px
		.article
			background #fff
		footer
			margin 0 20px
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
	.sns-share
		padding 6em 0 2em
		text-align center
		button
			display inline-block
			vertical-align top
			width 80px
			height 80px
			margin 0 1em
			border-radius 50%
			border none
			cursor pointer
			font-size 1.2rem
			color #fff
			transition .3s ease-in-out
			opacity .8
			i
				display block
				padding-top 10px
				line-height 30px
				font-size 30px
			span
				display block
				line-height 30px
				font-size 14px
			&:focus
				outline none
			&:hover
				opacity 1
			&.share-to-weibo
				background #fa7d3c
				background -webkit-linear-gradient(top, #fa7d3c 0%, #f55f10 100%)
				background linear-gradient(top bottom, #fa7d3c 0%, #f55f10 100%)
			&.share-to-wechat
				background #66BC54
				svg
					fill #fff
		.wechat-area
			padding 20px
			img
				width 400px
				max-width 100%
				box-shadow 2px 2px 4px rgba(0, 0, 0, .1), 2px 2px 15px rgba(0, 0, 0, .1)
	.comments-section
		position relative
		padding 2em 0 4em
		background #f5f8fa
		border 1px solid #edf0f3
		&:before
			position absolute
			content ''
			top -1rem
			left 50%
			margin-left -2rem
			width 0
			height 0
			border-style solid
			border-color transparent transparent #f5f8fa
			border-width 0 2rem 1rem
@media screen and (max-width 1000px)
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
<div class="blog-detail">
	<header>
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
				<div class="article" v-html="detail.content"></div>
				<footer>
					<p><strong>tags：</strong>
						<a
							v-for="(tag, index) in detail.tags"
							:key="tag + index"
							:href="'/blog?tag=' + tag"
						>{{tag}}</a>
					</p>
					<p><strong>转载请注明来源：</strong>http://bh-lay.com/blog/{{detail.id}}</p>
				</footer>
				<div class="sns-share">
					<button title="分享至新浪微博" class="share-to-weibo">
						<i class="l-icon l-icon-weibo"></i>
						<span>分享</span>
					</button>
					<button title="分享至微信" class="share-to-wechat">
						<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
							<path d="M405.333333 170.666667C228.693333 170.666667 85.333333 285.44 85.333333 426.666667 85.333333 507.306667 131.413333 578.56 203.946667 625.493333L170.666667 725.333333 277.333333 661.333333C315.306667 674.56 357.12 682.666667 401.493333 682.666667 390.4 655.786667 384 627.2 384 597.333333 384 456.106667 517.546667 341.333333 682.666667 341.333333 690.773333 341.333333 698.88 341.333333 706.56 342.613333 663.04 242.773333 545.28 170.666667 405.333333 170.666667M277.333333 277.333333C300.8 277.333333 320 296.533333 320 320 320 343.466667 300.8 362.666667 277.333333 362.666667 253.866667 362.666667 234.666667 343.466667 234.666667 320 234.666667 296.533333 253.866667 277.333333 277.333333 277.333333M490.666667 277.333333C514.133333 277.333333 533.333333 296.533333 533.333333 320 533.333333 343.466667 514.133333 362.666667 490.666667 362.666667 467.2 362.666667 448 343.466667 448 320 448 296.533333 467.2 277.333333 490.666667 277.333333M682.666667 384C541.44 384 426.666667 479.573333 426.666667 597.333333 426.666667 715.093333 541.44 810.666667 682.666667 810.666667 711.253333 810.666667 738.56 807.253333 764.16 800L853.333333 853.333333 826.88 773.546667C893.866667 734.72 938.666667 670.293333 938.666667 597.333333 938.666667 479.573333 823.893333 384 682.666667 384M597.333333 490.666667C620.8 490.666667 640 509.866667 640 533.333333 640 556.8 620.8 576 597.333333 576 573.866667 576 554.666667 556.8 554.666667 533.333333 554.666667 509.866667 573.866667 490.666667 597.333333 490.666667M768 490.666667C791.466667 490.666667 810.666667 509.866667 810.666667 533.333333 810.666667 556.8 791.466667 576 768 576 744.533333 576 725.333333 556.8 725.333333 533.333333 725.333333 509.866667 744.533333 490.666667 768 490.666667Z"/>
						</svg>
					</button>
					<div class="wechat-area"></div>
				</div>
			</div>
			<div class="article-section-side">
					<div class="article-section-body">
							<div class="toc-content">
									<div class="title">TOC</div>
							</div>
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
</div>
</template>
<script>
import Comments from '@/components/comments/index.vue'

// 图片预加载
function loadImg (src, callback) {
	if (!src) {
		callback && callback()
		return
	}
	let img = new Image()
	img.crossOrigin = 'Anonymous'

	function End () {
		callback && callback(img)
		callback = null
	}

	img.onerror = img.onload = End
	img.src = src
}
function prefixID (htmlPart) {
	let idMatches = htmlPart.match(/^<h\d\s[^>]*data-id=(?:"|')([^"']+)/)
	let id = ''
	if (idMatches) {
		id = idMatches[1]
	} else {
		id = parseInt(Math.random() * 1000, 10) + '_' + parseInt(Math.random() * 100 * 100)
		htmlPart = htmlPart.replace(/(^<h\d)/, `$1 data-id="${id}" `)
	}
	return {
		htmlPart,
		id
	}
}
function getToc (article) {
	var toc = []
	article = article.replace(/<h(\d)(?:\s[^>]+)*>([^<]+)/g, (htmlPart, indent, text) => {
		let prefix = prefixID(htmlPart, indent, text)
		toc.push({
			indent,
			text,
			id: prefix.id
		})
		return prefix.htmlPart
	})
	let minItendent = Math.min.apply(Math, toc.map(item => item.indent))
	toc.forEach(item => {
		item.indent = item.indent - minItendent
	})
	return {
		article,
		toc
	}
}

export default {
	name: 'blogDetail',
	components: {
		Comments
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
			}
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
		init (detail) {
			fetch(`/api/blog/${this.blogID}?format=html`)
				.then(response => response.json())
				.then(data => {
					for (let key in this.detail) {
						this.detail[key] = data.detail[key]
					}
				})
		},
		createSharePop () {
			// let wechatNode = utils.query('.wechat-area', this.element)
			// if (wechatNode.children.length) {
			// 	wechatNode.innerHTML = ''
			// 	return
			// }
			// require.ensure(['asyncShareForMobile'], () => {
			// 	// 引入 ace
			// 	let {createShareCard} = require('asyncShareForMobile');
			// 	let url = 'http://bh-lay.com/blog/' + this.detail.id;
			// 	let coverUrl = this.detail.cover

			// 	coverUrl = coverUrl ? imageHosting(coverUrl) : ''
			// 	let canvas = createShareCard({
			// 		title: this.detail.title,
			// 		intro: this.detail.intro,
			// 		url,
			// 		coverUrl
			// 	})
			// 	wechatNode.appendChild(canvas)
			// })
		},
		addCover (originCoverUrl) {
			// let hasCover = originCoverUrl && originCoverUrl.length;
			// // let header = utils.query('header', this.element);
			// if (!hasCover) {
			// 	// utils.addClass(header, 'no-cover');
			// 	return
			// }
			// let coverUrl = imageHosting(originCoverUrl, {
			// 	type: 'zoom',
			// 	width: 420,
			// });

			// loadImg(coverUrl, function (img) {
			// 	let width = header.clientWidth;
			// 	let height = header.clientHeight;
			// 	let canvas = document.createElement('canvas');
			// 	let context = canvas.getContext('2d');
			// 	// gaussBlur
			// 	let newWidth = width;
			// 	let newHeight = width * img.height / img.width;
			// 	if (newHeight < height) {
			// 		newHeight = height;
			// 		newWidth = height * img.width / img.height;
			// 	}
			// 	let top = (height - newHeight) / 2;
			// 	let left = (width - newWidth) / 2;
			// 	canvas.width = width;
			// 	canvas.height = height;
			// 	context.drawImage(img, left, top, newWidth, newHeight)
			// 	context.fillStyle = 'rgba(0,0,0,0.4)'
			// 	context.fillRect(0, 0, width, height)
			// 	blurRect(context, 0, 0, width, height, 8, 1);
			// 	// header.appendChild(canvas);
			// 	let bluredImg = canvas.toDataURL('image/png')
			// 	header.style.backgroundImage = `url(${bluredImg})`
			// });
		},
		addCodeSupport () {
			// 代码高亮
			// utils.each(utils.queryAll('pre code', this.element), function (codeNode) {
			// 	hljs(codeNode);
			// });
		},
		addComment () {
		},
		addToc () {
			// 绑定 toc 点击事件
			// utils.bind(utils.query('.toc-content', this.element), 'click', 'a', function (event) {
			// 	let href = this.getAttribute('href').replace(/^#/, '')
			// 	let node = utils.query('[data-id="' + href + '"]')
			// 	if (!node) {
			// 		return
			// 	}
			// 	let top = utils.offset(node).top - 80
			// 	window.scrollTo(0, top)
			// });
			// let nodeTag = utils.query('.toc-content', this.element)
			// this.tie = new Tie({
			// 	dom: nodeTag,
			// 	scrollDom: this.element,
			// 	scopeDom: utils.parents(nodeTag, '.article-section'),
			// 	fixed_top: 60
			// });
		}
	}
}
</script>
