<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../assets/stylus/variable.styl'
@import '../../assets/stylus/mixin.styl'

.labs-list-pager
	background #dee3e7
.labs-header
	height 300px
/**实验室列表**/
.labs-sub-header
	min-height 50px
	background #fff
	box-shadow 0 0 2px rgba(0, 0, 0, .2)
	.labs-sub-header-inner
		position relative
	.labs-profile-card
		position absolute
		top -90px
		left 10px
		width 140px
		height 150px
		background #fff
		box-shadow 2px 2px 10px rgba(0, 0, 0, .1), 5px 5px 5px -4px rgba(0, 0, 0, .2)
		.icon
			height 40px
			padding-top 20px
			::v-deep svg
				display block
				width 40px
				margin auto
				color #2b353b
		span
			display block
			line-height 30px
			text-align center
			font-size 14px
			color #2b353b
		.button
			padding-top 10px
			text-align center
	.notice
		margin 0
		padding 16px 0 16px 160px
		line-height 20px
		font-size 14px
		color #333

.post-list
	min-height 400px
	margin 0 -8px
	padding 40px 0
	display flex
	flex-wrap wrap
	.post-item,
	& > i
		width 360px
		flex-grow 1
		margin 0 8px 16px
	& > i
		display block
		height 0
		margin-bottom 0
		padding 0
		line-height 0
		font-size 0
@media (max-width: $max-mobile-width)
	.labs-sub-header
		padding 15px
		.labs-profile-card
			position static
			margin auto
		.notice
			padding 15px
	.post-list
		margin 0 -5px
		padding-top 10px
		.post-item,
		& > i
			width 40%
			margin-left 4px
			margin-right 4px
		.post-item
			margin-bottom 8px
</style>
<template>
<div class="labs-list-pager">
	<div class="labs-header">
		<headerBanner
			:photoGraphaList="photoGraphaList"
			:photoGraphaIndex="photoGraphaIndex"
			@nextIndex="nextIndex"
		/>
	</div>
	<div class="labs-sub-header">
		<Container class="labs-sub-header-inner">
			<div class="labs-profile-card">
				<div class="icon">
					<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
						<path d="M787.696941 669.515294c0 44.935529-23.431529 118.181647-78.787765 118.181647-55.416471 0-78.848-73.246118-78.848-118.181647 0-44.875294 23.431529-118.181647 78.848-118.181647 55.356235 0 78.787765 73.306353 78.787765 118.181647zM315.090824 551.333647c-55.356235 0-78.787765 73.306353-78.787765 118.181647 0 44.935529 23.431529 118.181647 78.787765 118.181647s78.787765-73.246118 78.787764-118.181647c0-44.875294-23.431529-118.181647-78.787764-118.181647zM1024 561.212235c0 68.367059-6.746353 140.950588-37.526588 203.715765-81.257412 164.321882-304.609882 180.284235-464.594824 180.284235-162.454588 0-399.36-14.095059-483.689412-180.284235C6.746353 702.765176 0 629.579294 0 561.212235c0-89.871059 24.636235-174.742588 83.727059-243.651764a338.160941 338.160941 0 0 1-16.624941-104.688942c0-46.140235 10.420706-92.220235 31.382588-134.144 97.219765 0 159.382588 42.465882 233.231059 100.291765a823.536941 823.536941 0 0 1 190.162823-21.504c57.825882 0 116.314353 6.204235 172.333177 19.696941 73.246118-57.223529 135.348706-98.484706 231.363764-98.484706 20.961882 41.863529 31.382588 88.003765 31.382589 134.144 0 35.117176-5.541647 70.174118-16.624942 103.424C999.424 385.807059 1024 471.341176 1024 561.212235z m-137.878588 108.303059c0-94.147765-57.163294-177.212235-157.515294-177.212235-40.598588 0-79.329882 7.408941-119.988706 12.950588-31.984941 4.939294-63.969882 6.746353-96.617412 6.746353s-64.632471-1.807059-96.617412-6.746353c-39.996235-5.541647-79.390118-12.950588-119.988706-12.950588-100.291765 0-157.515294 83.064471-157.515294 177.212235 0 188.295529 172.272941 217.208471 322.43953 217.208471h103.424c150.166588 0.060235 322.379294-28.912941 322.379294-217.208471z"></path>
					</svg>
				</div>
				<span>{{thirdProfile.title}}</span>
				<div class="button">
					<Button :href="thirdProfile.url" target="_blank" type="primary" size="small">查看</Button>
				</div>
			</div>
			<p class="notice">{{intro}}</p>
		</Container>
	</div>
	<Container>
		<div class="post-list" v-loading="isLoading">
			<Item
				v-for="item in postList"
				:key="item.id"
				:post="item"
			/>
			<i /><i /><i /><i /><i /><i />
		</div>
	</Container>
	<Footer />
</div>
</template>

<script>
import headerBanner from '@/components/header-banner/index.vue'
import Item from './item.vue'
import image1 from '@/components/sns-page-layout/images/opus_@2x.jpg'
import image2 from '@/components/sns-page-layout/images/yangshuo.jpg'

let globalPhotoGraphaIndex = 0

export default {
	components: {headerBanner, Item},
	props: {
		intro: {
			type: String,
			default: ''
		},
		thirdProfile: {
			type: Object,
			default () {
				return {
					url: ''
				}
			}
		},
		postList: {
			type: Array,
			default () {
				return []
			}
		},
		isLoading: {
			type: Boolean,
			default: true
		}
	},
	data () {
		return {
			photoGraphaList: [
				{
					imgSrc: image1,
					htmlSrc: 'https://bh-lay.tuchong.com/14431809/#image24933177',
					title: '宏村',
					author: '剧中人'
				}, {
					imgSrc: image2,
					htmlSrc: 'https://720yun.com/t/544jOrkvtn0?from=bh-lay',
					title: '桂林阳朔',
					author: '剧中人'
				}
			],
			photoGraphaIndex: globalPhotoGraphaIndex
		}
	},
	methods: {
		nextIndex (index) {
			globalPhotoGraphaIndex = index
		}
	}
}
</script>
