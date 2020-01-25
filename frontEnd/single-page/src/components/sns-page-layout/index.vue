<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~@/assets/stylus/variable.styl'
@import '~@/assets/stylus/mixin.styl'

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
			:global(svg)
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
		width 240px
		flex-grow 1
		margin 0 8px 16px
	& > i
		display block
		height 0
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
					<slot name="profile-icon" />
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
		<div class="post-list">
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

let globalPhotoGraphaIndex = 0

export default {
	name: 'sns-page-layout',
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
		}
	},
	data () {
		return {
			photoGraphaList: [
				{
					imgSrc: require('./images/opus_@2x.jpg'),
					htmlSrc: 'https://bh-lay.tuchong.com/14431809/#image24933177',
					title: '宏村',
					author: '剧中人'
				}, {
					imgSrc: require('./images/yangshuo.jpg'),
					htmlSrc: 'http://720yun.com/t/544jOrkvtn0?from=bh-lay',
					title: '桂林阳朔',
					author: '剧中人'
				}
			],
			photoGraphaIndex: globalPhotoGraphaIndex
		}
	},
	created () {
	},
	methods: {
		nextIndex (index) {
			globalPhotoGraphaIndex = index
		}
	}
}
</script>
