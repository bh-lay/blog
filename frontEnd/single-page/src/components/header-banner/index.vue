<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~@/assets/stylus/variable.styl'
@import '~@/assets/stylus/mixin.styl'

.header-banner
	position relative
	background no-repeat center center #f4f1ec
	background-size auto 100%
	height 100%
	min-height 200px
	overflow hidden
	photography()
</style>
<template>
<div class="header-banner" :style="{
	backgroundImage: `url(${photography.imgSrc})`
}">
	<div class="photograghy-author">
		<a :href="photography.htmlSrc" target="_blank">{{photography.title}} By:@{{photography.author}}</a>
	</div>
</div>
</template>

<script>

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

export default {
	name: 'header-banner',
	props: {
		photoGraphaList: {
			type: Array
		},
		photoGraphaIndex: {
			type: Number,
			default: 0
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
			this.photography = this.photoGraphaList[this.photoGraphaIndex]

			let nextIndex = this.photoGraphaIndex + 1
			if (nextIndex >= this.photoGraphaList.length) {
				nextIndex = 0
			}
			this.$emit('nextIndex', nextIndex)
			loadImg(this.photography.imgSrc, () => {
				this.photographyLoaded = true
			}, 600)
		}
	}
}
</script>
