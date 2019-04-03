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
		width 200px
		margin-left -1000px
		padding-left 1000px
		padding-top $navigation-height + 30px
		padding-right 30px
		border-right 1px solid #e0e6eb
		background #f6f7f9
	.page-content
		flex-grow 1
		padding-top $navigation-height + 30px
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
							<a v-if="detail.url" target="_blank" class="blog" :href="detail.url | urlPrefix">博客</a>
							<a
								v-if="detail.github_username"
								target="_blank"
								class="github"
								:href="detail.githubLink | urlPrefix"
							>Github</a>
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
						/>
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
