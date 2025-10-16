<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/variable.styl'
@import '../../common/stylus/mixin.styl'

.pano-list-pager
	background #f0f1f5
.pano-header
	position relative
	background #ddd
	.header-gallery
		opacity 0
		transition 2s
	&.header-visible
		.header-gallery
			opacity 1
	.panorama-author
		position absolute
		bottom 10px
		left 0
		width: 100%
		text-align right
		opacity .2
		transition .4s
		a
			font-size 12px
			color #fff
			text-shadow 1px 1px 1px #000, 0 0 5px rgba(0, 0, 0, 0.5)
			&:hover
				text-decoration underline
	&:hover .panorama-author
		opacity 1

.post-list
	--grid-size 124px
	--grid-gap 4px
	min-height 400px
	display grid
	grid-template-columns repeat(auto-fill, var(--grid-size))
	grid-template-rows repeat(auto-fill, var(--grid-size))
	grid-auto-flow dense
	gap var(--grid-gap)
	justify-content center
.post-item
	display block
	position relative
	// box-shadow 1px 1px 2px rgba(0, 0, 0, .2)
	background #e2e3e9
	overflow hidden
	&.size-4-4
		grid-area span 4 / span 4 / auto /
		width calc(var(--grid-size) * 4 + var(--grid-gap) * 3)
		height calc(var(--grid-size) * 4 + var(--grid-gap) * 3)
		font-size 24px
	&.size-2-2
		grid-area span 2 / span 2 / auto /
		width calc(var(--grid-size) * 2 + var(--grid-gap) * 1)
		height calc(var(--grid-size) * 2 + var(--grid-gap) * 1)
		font-size 16px
	&.size-1-1
		grid-area span 1 / span 1 / auto /
		width calc(var(--grid-size) * 1)
		height calc(var(--grid-size) * 1)
		font-size 12px
	.cover
		display block
		width 100%
		height 100%
		&:before
			content ''
			display block
			padding-top 100%
	.title
		position absolute
		left 0
		bottom 0
		width 100%
		height 6em
		box-sizing border-box
		padding 3.5em 0 0.5em 1em
		line-height 2em
		font-size 1em
		font-weight 900
		color #fff
		white-space nowrap
		overflow hidden
		text-overflow ellipsis
		background linear-gradient(transparent, rgba(0,0,0,.6))
.pano-profile
	grid-area span 4 / span 2 / auto /
	width calc(var(--grid-size) * 2 + var(--grid-gap) * 1)
	height calc(var(--grid-size) * 4 + var(--grid-gap) * 3)
	background linear-gradient(50deg, #091d3d, rgba(20, 120, 50, 60%))
	background-color transparent
	.part-a
		display flex
		flex-direction column
		justify-content center
		width 65%
		height 62%
		margin 0 auto
		padding 0 12px
		border-bottom 1px solid rgba(255, 255, 255, .07)
		span
			margin 40px 0 12px
			color #fff
			opacity .6
		img
			width 68px
			margin-bottom 90px
		.ui-button-primary
			width 100%
	.part-b
		padding 32px 45px 0
		h2
			display flex
			justify-content space-between
			margin 0
			line-height 1em
			text-align center
			font-size 65px
			font-weight 200
			color #fff
		h3
			margin 32px 0 0
			letter-spacing 6px
			line-height 1em
			text-align center
			font-size 24px
			font-weight 200
			color rgba(255, 255, 255, .6)
		
@media screen and (min-width $pad-portrait-width)
	.pano-header
		height 540px
		&:before
			content ""
			position absolute
			left 0
			bottom 0
			width 100%
			height 100%
			z-index 1
			background-image linear-gradient(0deg, #f0f1f5, transparent 300px), linear-gradient(0deg, #f0f1f5, transparent 100px)
		&:after
			content ""
			position absolute
			left 0
			bottom -10px
			width 100%
			height 20px
			z-index 1
			background-image linear-gradient(0deg, transparent, #f0f1f5, transparent)
		.panorama-author
			bottom 150px
			z-index 2
	.main-pager
		position relative
		z-index 1
		margin-top -140px !important
		padding-bottom 50px
	.post-item
		.cover
			transition .2s ease-in-out
		&:hover
			.cover
				opacity .6
@media screen and (max-width $pad-portrait-width)
	.pano-header
		height 40vw
		margin-bottom 20px
	.main-pager
		padding-bottom 20px
	.post-list
		--grid-size 120px
	.post-item
		&.size-4-4
			grid-area span 3 / span 3 / auto /
			width calc(var(--grid-size) * 3)
			height calc(var(--grid-size) * 3)
		&.size-4-2
			grid-area span 2 / span 4 / auto /
			width calc(var(--grid-size) * 4)
			height calc(var(--grid-size) * 2)
</style>
<template>
<div class="pano-list-pager navigation-shadow">
	<div class="pano-header" :class="panoVisible ? 'header-visible' : ''">
		<header-gallery @pano-ready="panoVisible = true"/>
		<div class="panorama-author">
			<Container>
				<a href="https://www.720yun.com/t/0bcjO5tusy1?scene_id=2337588" target="_blank">《妹纸们》素材来自 @SNH48 后期 By 剧中人</a>
			</Container>
		</div>
	</div>
	<Container class="main-pager">
		<div class="post-list" v-loading="isLoading">
			<div class="post-item pano-profile">
				<div class="part-a">
					<span>作品托管在</span>
					<img :src="logo" alt="720 云平台" />
					<Button :href="thirdProfile.url" target="_blank" type="primary" size="small">小剧的 720 云主页</Button>
				</div>
				<div class="part-b">
					<h2><span>全</span><span>景</span></h2>
					<h3>记录新方式</h3>
				</div>
			</div>
			<a
				v-for="item in postList"
				:key="item.id"
				class="post-item"
				:class="`size-${item.size || '1-1'}`"
				:href="item.url"
				target="_blank"
			>
				<img v-lazy :src="item.thumb" class="cover" />
				<div class="title">{{item.title}}</div>
			</a>
		</div>
	</Container>
	<Footer />
</div>
</template>

<script>
import panoData from './data.json'
export default {
	name: 'pano-page',
	components: {
		HeaderGallery: () => import('./header-gallery.vue')
	},
	data () {
		return {
			logo: 'data:image/png;base64,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',
			thirdProfile: {
				url: 'https://720yun.com/u/19023widcyv'
			},
			postList: [],
			panoVisible: false,
			isLoading: false
		}
	},
	mounted() {
		setTimeout(() => {
			this.postList = panoData
		}, 120)
	}
}
</script>
