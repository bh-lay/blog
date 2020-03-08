<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.stick-list
	padding-top 20px
.status
	height 52px
	margin-bottom 20px
.article-item
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
		color #22252a
		outline none
	img
		display block
		background #eee
		max-width 100%
		margin auto
	.info
		padding 20px
		line-height 1.4
		font-size 13px
		color #8a98a8
		text-indent 2em
	.label
		position absolute
		top 0
		right 0
		width 30px
		height 30px
		background #f70
		border 1px solid #c7cdd1
		border-width 0 0 1px 1px
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
			strong
				font-size 12px
				color #73828c
				font-weight normal
			a
				display inline-block
				padding 0 5px
				font-size 13px
				color #73828c
				text-decoration none
				&:hover
					text-decoration underline
					color #000
				&.router-link-exact-active
					border-radius 4px
					background #29353d
					color #a7b5be
					cursor default
		.time
			white-space nowrap
			color #888
			font-size 12px
	&.pure-text .link
			background url("./blog-card.jpg") no-repeat top right #fff
			background-size 170px 34px
	&:hover
		box-shadow 5px 10px 10px -5px rgba(0, 0, 0, .2)

@media (max-width: $max-mobile-width)
	.stick-list
		padding-top 10px
	.article-item
		.title
			padding: 1em 0 0.2em;
			font-size 14px
		.info
			padding 5px 10px 15px
			font-size 12px
		footer
			display none
		&.pure-text .link
			padding-top 5px
			background-size 85px 17px
</style>
<template>
<div class="stick-list">
	<div ref="scrollMark"></div>
	<Stick
		:list="list"
		imgKey="cover"
		:columnWidth="isMobile ? 170 : 280"
		:columnSpacing="isMobile ? 5 : 10"
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
					<div class="info">{{scope.data.intro}}</div>
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
	<div class="status" v-loading="isLoading"></div>
</div>
</template>

<script>
import Stick from 'vue-stick'

const prefixBlogList = list => {
	list = list || []

	let now = new Date().getTime()
	list.forEach(item => {
		// 三个月内的博文都算新闻章
		item.is_new = (now - item.time_show) / (1000 * 60 * 60 * 24) < 90
	})

	return list
}
export default {
	name: 'blogPageStick',
	components: {
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
			isLoading: false,

			isMobile: window.innerWidth < 600
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
			this.$refs.scrollMark.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'nearest'
			})
		},
		loadMore () {
			// 防止重复加载
			if (this.isLoading) {
				return
			}
			// 超出总量不加载
			if (this.page.skip >= this.page.count) {
				return
			}
			this.isLoading = true
			fetch(`/api/blog?skip=${this.page.skip}&limit=${this.page.limit}&tag=${this.tag}`, {
				method: 'GET'
			})
				.then(response => response.json())
				.then(data => {
					this.page.count = data.count
					this.page.skip += this.page.limit
					let blogList = prefixBlogList(data.list)
					this.list = this.list.concat(blogList)
				})
				.catch(() => {})
				.then(() => {
					this.isLoading = false
				})
		}
	},
	watch: {
		$route () {
			this.refresh()
		}
	}
}
</script>
