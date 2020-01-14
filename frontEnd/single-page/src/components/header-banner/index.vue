<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~@/assets/stylus/variable.styl'
@import '~@/assets/stylus/mixin.styl'

.header-banner
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
</style>
<template>
<div class="header-banner" :style="{
	backgroundImage: `url(${photography.imgSrc})`
}">
	<div class="photograghy-author">
		<a :href="photography.htmlSrc" target="_blank">{{photography.title}} By:@剧中人</a>
	</div>
</div>
</template>

<script>
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
	name: 'header-banner',
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
