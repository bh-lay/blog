<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~@/assets/stylus/variable.styl'
@import '~@/assets/stylus/mixin.styl'

.labs-list-pager
	background #dee3e7

/**实验室列表**/
.labs-header
	position relative
	background no-repeat center center #f4f1ec
	background-size auto 100%
	min-height 200px
	max-height 400px
	overflow hidden
	photography()
	&:before
		content ''
		display block
		padding-top 21%
.labs-sub-header
	min-height 50px
	background #fff
	box-shadow 0 0 2px rgba(0, 0, 0, .2)
	.labs-sub-header-inner
		position relative
	.labs-profile-card
		position absolute
		top -60px
		left 10px
		width 140px
		box-shadow 5px 5px 5px -4px rgba(0, 0, 0, .2)
		a
			display block
			height 120px
			padding-top 1px
			background-color #fafafa
			transition .2s
			line-height 20px
			font-size 16px
			text-align center
			color #000
			&:hover
				color #000
				background-color #eee
	.notice
		margin 0
		padding 16px 0 16px 160px
		line-height 20px
		font-size 14px
		color #333

@media (max-width: 600px)
	.labs-sub-header
		padding 15px
		.labs-profile-card
			position static
			margin auto
		.notice
			padding 15px

.post-list
	min-height 400px
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
</style>
<template>
<div class="labs-list-pager">
	<div class="labs-header" :style="{
		backgroundImage: `url(${photography.imgSrc})`
	}">
		<div class="photograghy-author">
			<a :href="photography.htmlSrc" target="_blank">{{photography.title}} By:@剧中人</a>
		</div>
	</div>
	<div class="labs-sub-header">
		<Container class="labs-sub-header-inner">
			<div class="labs-profile-card">
				<a :href="thirdProfile.url" target="_blank">
					{{thirdProfile.title}}
				</a>
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
</div>
</template>

<script>
import Item from './item.vue'

let potoGraphaList = [
	{
		imgSrc: require('./images/opus_@2x.jpg'),
		htmlSrc: 'https://bh-lay.tuchong.com/14431809/#image24933177',
		title: '宏村'
	}, {
		imgSrc: require('./images/yangshuo.jpg'),
		htmlSrc: 'http://720yun.com/t/544jOrkvtn0?from=bh-lay',
		title: '桂林阳朔'
	}
]

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
let photoGraphaIndex = -1

export default {
	name: 'sns-page-layout',
	components: {Item},
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
			photographyLoaded: false,
			photography: {}
		}
	},
	created () {
		this.getBannerList()
	},
	methods: {
		getBannerList () {
			this.photography = potoGraphaList[++photoGraphaIndex]
			if (photoGraphaIndex + 1 >= potoGraphaList.length) {
				photoGraphaIndex = -1
			}
			loadImg(this.photography.imgSrc, () => {
				this.photographyLoaded = true
			}, 600)
		}
	}
}
</script>
