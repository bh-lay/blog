<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
$banner-height = 400px
.banner
	height $banner-height + $navigation-height
	.banner-item
		padding-top $navigation-height
		height $banner-height
	.banner-item-body
		height $banner-height
		background-size cover
		background-position center center
		background-repeat no-repeat
.some-tools
	padding 30px 0
	background #f0f1f5
	border 1px solid #fff
	border-width 1px 0
	.some-tools-body
		height 140px
		display flex
	.analysis-count
		flex-grow 1
		display flex
		justify-content space-around
		align-items center
		width 200px
		border 1px solid #e0e6eb
		background #fff
		.item
			text-align center
			.count
				padding-left 8px
				strong
					margin-right 5px
					font-size 28px
					font-weight 300
					color #2e3038
				span
					font-size 14px
					color #8f93a3
			.title
				color #8f93a3
.index-main
	background #fff
.index-main-body
	display flex
	min-height 600px
	.index-sidebar
		width 160px
		margin-left -3000px
		padding-left 3000px
		padding-top 30px
		padding-right 20px
		border-right 1px solid #e7ebef
		background #f6f7f9

	.index-content
		flex-grow 1
		padding 30px 0 60px
	.index-sidebar-secondary
		width 240px
		padding 30px 0 50px 20px
		.zanshangma
			img
				display block
				width 100%
	.view-all-post
		display block
		margin 0 40px
		background #0a85c2
		line-height 44px
		text-decoration none
		text-align center
		font-size 16px
		color #fff
		transition .2s
		&:hover
			background #175e82
.module-title
	padding 5px 15px
	font-size 14px
	font-weight bold
	color #454a54
	background #eeeff1
</style>
<template>
	<div class="index-page">
		<div class="banner">
			<div
				class="banner-item"
				v-for="(banner, index) in bannerList"
				:key="index"
				:style="{
					backgroundColor: banner.backgroundColor
				}"
			>
				<div class="page-container">
					<div class="banner-item-body"
						:style="{
							backgroundImage: `url(${banner.imgUrl})`
						}"
					>
					</div>
				</div>
			</div>
		</div>
		<div class="some-tools">
			<div class="page-container">
				<div class="some-tools-body">
					<feedback />
					<div class="analysis-count">
						<div
							class="item"
							v-for="(item, index) in analysis"
							:key="index"
						>
							<div class="count">
								<strong>{{item.count}}</strong><span>{{item.unit}}</span>
							</div>
							<div class="title">{{item.title}}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="index-main">
			<div class="page-container">
				<div class="index-main-body">
					<div class="index-sidebar">
						<div class="module-title">热门标签</div>
						<tagList />
						<br>
					</div>
					<div class="index-content">
						<postList
							:disablePagination="true"
						/>

						<router-link
							to="/post/page/2"
							class="view-all-post"
						>查看全部动态</router-link>
					</div>
					<div class="index-sidebar-secondary">
						<div class="module-title">推荐阅读</div>
						<recommandReading />
						<br>
						<div class="module-title">打赏</div>
						<div class="zanshangma">
							<img src="./images/zanshangma.png" alt="微信赞赏码">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import postList from '@/components/post/list.vue'
import recommandReading from './recommandReading.vue'
import tagList from './tag-list.vue'
import feedback from './feedback.vue'

export default {
	name: 'index',
	components: {postList, feedback, recommandReading, tagList},
	data () {
		return {
			bannerList: [
				{
					backgroundColor: '#3d271c',
					imgUrl: 'https://news.720yun.com/home/o_1d6p9kq541lk117h9dr61uoe1sgc.jpg'
				}
			],
			analysis: [
				{
					count: 162,
					unit: '位',
					title: '好友入驻'
				},
				{
					count: 537,
					unit: '篇',
					title: '文章引入'
				},
				{
					count: 41,
					unit: '个',
					title: '常用标签'
				}
			]
		}
	},
	created () {
	}
}
</script>
