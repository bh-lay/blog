<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
$avatar-width = 120px
.friend-detail-page
	min-height 800px
	background #f6f7f9
.header
	padding-top $navigation-height
	background #333
	.header-body
		display flex
		align-items flex-end
		height 200px
		.avatar
			position relative
			width $avatar-width
			height $avatar-width
			margin-bottom -20px
			border-radius 8px
			border 10px solid #fff
			background no-repeat center center #fff
			background-size cover
			box-shadow 2px 2px 10px rgba(0, 0, 0, .1)
		.intro
			padding 20px
			.title
				margin-bottom 15px
				font-size 28px
				color #fff
			.desc
				color #fff
.page-main
	background #fff
.page-main-body
	display flex
	min-height 600px
	.page-sidebar
		width 280px
		margin-left -1000px
		padding-left 1000px
		padding-top 60px
		padding-right 30px
		border-right 1px solid #e0e6eb
		background #f6f7f9
		.links
			.item
				margin-bottom 20px
				.label
					font-size 16px
					color #a2a8b3
				a
					display block
					word-break break-all
					line-height 20px
					text-decoration none
					font-size 18px
					color #5c6370
					&:hover
						text-decoration underline
						color #0095ff
		.numbers
			display flex
			justify-content center
			height 40px
			margin 80px 0
			padding 20px 0 30px
			border-top 1px solid #e0e4eb
			list-style none
			li
				width 80px
				text-align center
				span
					display block
					height 20px
					font-size 16px
					color #a2a8b3
				strong
					display block
					height 20px
					font-weight normal
					font-size 20px
					color #5c6370

	.page-content
		flex-grow 1
		padding-top 30px
	.empty-tips
		height 500px
		padding 40px 50px
		svg
			width 160px
			fill #f1f3f4
		p
			margin 0
			padding-left 10px
			line-height 30px
			font-size 18px
			color #8f9aa3
</style>
<template>
	<div class="friend-detail-page">
		<div class="header">
			<div class="page-container">
					<div class="header-body">
						<div
							class="avatar"
							:style="{
								backgroundImage: `url(${detail.avatar})`
							}"
						>
						</div>
					<div class="intro">
						<div class="title">{{detail.title}}</div>
						<div class="desc">{{detail.discription}}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="page-main">
			<div class="page-container">
				<div class="page-main-body">
					<div class="page-sidebar">
						<div class="links">
							<div class="item" v-if="detail.github_username">
								<div class="label">Github</div>
								<a
									target="_blank"
									class="github"
									:href="detail.githubLink | urlPrefix"
								> {{detail.github_username}}</a>
							</div>
							<div class="item" v-if="detail.url">
								<div class="label">博客</div>
								<a
									target="_blank"
									class="github"
									:href="detail.url | urlPrefix"
								> {{detail.url}}</a>
							</div>
						</div>
						<ul class="numbers">
							<li>
								<span>查看</span>
								<strong>2123621</strong>
							</li>
							<li>
								<span>引用</span>
								<strong>52</strong>
							</li>
						</ul>
					</div>
					<div class="page-content">
						<postList
							:firstPage="$route.params.page"
							:friendID="friendID"
						>
							<template slot="empty-tips">
								<div class="empty-tips">
									<svg viewBox="200 200 600 600" version="1.1" xmlns="http://www.w3.org/2000/svg">
										<path d="M767.3 736.6H246.8c-4.3 0-7.8-3.5-7.8-7.8V686c0-4.3 3.5-7.8 7.8-7.8h520.5c4.3 0 7.8 3.5 7.8 7.8v42.8c0 4.3-3.5 7.8-7.8 7.8z"></path>
										<path d="M347.4 311.5c2 0 3.7 0.5 5.5 1.6l220.4 143c2.9 1.9 6.3 3 9.8 3 1.6 0 3.2-0.2 4.8-0.6l129.9-30.9c3.5-0.8 6.9-1.3 10.3-1.3 17.3 0 32.8 10.4 37.5 26.1 5.6 18.8-6.6 38-28.1 43.1L600 528.3l-112.5 27.2-137.4 32.8-28.6 7c-1.5 0.4-3 0.5-4.5 0.5-6.4 0-12.3-3.2-15.7-8.5l-12.7-19.7-39.9-62.4c-3.8-5.2-0.5-12.7 5.6-14.1l20.6-5.2c0.6-0.1 1.2-0.2 1.8-0.2 1.9 0 3.9 0.5 5.7 1.6l40.8 28.6c3.1 2.1 6.9 3.4 10.8 3.4 1.4 0 2.8-0.2 4.2-0.6l88.2-22.5c14.1-3.3 19.2-20.6 9.4-30.9L310.7 334.2c-5.2-5.2-2.3-13.6 4.7-15.5l30-7c0.7-0.2 1.3-0.2 2-0.2m0-18.7c-1.7 0-3.4 0.1-5.1 0.4-0.4 0.1-0.8 0.1-1.2 0.2l-30 7c-0.2 0-0.4 0.1-0.5 0.1-9.9 2.6-17.6 10.3-20.2 20.1-2.6 9.5 0 19.4 7 26.4l125 131.1c-0.1 0-0.3 0.1-0.4 0.1l-88 22.6c-0.1 0-0.2-0.1-0.3-0.1l-40.5-28.4c-0.4-0.3-0.7-0.5-1.1-0.7-4.6-2.8-9.9-4.2-15.3-4.2-1.9 0-3.7 0.2-5.5 0.5-0.3 0.1-0.6 0.1-0.9 0.2l-20.5 5.1c-9 2.2-16.4 8.7-19.7 17.5-3.2 8.4-2 17.8 3 25l39.6 62 12.7 19.7c6.9 10.7 18.6 17.1 31.4 17.1 2.9 0 5.9-0.3 8.8-1h0.2l28.5-7 137.3-32.8 112.6-27.2 137.3-32.8c16.1-3.9 29.3-13.4 37-26.8 7-12.2 8.7-26.4 4.7-39.8-3.5-11.6-11-21.8-21.3-28.9-9.9-6.9-21.7-10.5-34-10.5-4.9 0-9.9 0.6-14.7 1.8l-129.8 30.9c-0.1 0-0.1 0-0.2 0.1L363 297.4l-0.6-0.3c-4.6-2.8-9.7-4.3-15-4.3z"></path>
										<path d="M708.7 474.9c6.3 6.3 16.6 6.3 22.9 0 6.3-6.3 6.3-16.6 0-22.9-6.3-6.3-16.6-6.3-22.9 0-6.4 6.3-6.4 16.6 0 22.9-0.1 0-0.1 0 0 0zM498.8 520.1l40.3-10.5c7.4-1.9 11.9-9.5 9.9-16.9-1.9-7.4-9.5-11.9-16.9-9.9l-40.3 10.5c-7.4 1.9-11.9 9.5-9.9 16.9 1.9 7.4 9.5 11.8 16.9 9.9z m0 0"></path>
									</svg>
									<p>小剧比较懒！<br/>还没有引用{{detail.title}}的动态呢！</p>
								</div>
							</template>
						</postList>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import postList from '@/components/post/list.vue'
export default {
	name: 'friendDetailPage',
	components: {postList},
	data () {
		return {
			detail: {
				avatar: '',
				title: '',
				discription: '',
				url: '',
				github_username: ''
			}
		}
	},
	created () {
		this.getFriendDetail()
	},
	methods: {
		getFriendDetail () {
			fetch(`/api/moment/friend/${this.friendID}`, {
				method: 'GET'
			})
				.then(response => response.json())
				.then(({code, detail}) => {
					if (detail.github_username) {
						detail.githubLink = 'https://github.com/' + detail.github_username
					} else {
						detail.githubLink = ''
					}
					this.detail = detail
				})
		}
	},
	computed: {
		friendID () {
			return this.$route.params.id
		}
	}
}
</script>
