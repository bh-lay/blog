<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~@/assets/stylus/variable.styl'
@import '~@/assets/stylus/mixin.styl'
.header-banner-outer
	height 100%
	min-height 200px
	overflow hidden
	background #eee
.header-banner
	position relative
	height 100%
	background no-repeat center center #f4f1ec
	background-size auto 100%
	visibility hidden
	background-size cover
	.photograghy-author
		position absolute
		right 10px
		bottom 10px
		opacity .6
		transition .4s
		a
			font-size 12px
			color #fff
			text-shadow 1px 1px 1px #000, 0 0 5px rgba(0, 0, 0, 0.5)
			&:hover
				text-decoration underline
	&:hover .photograghy-author
		opacity 1

	&:before
		content ''
		position absolute
		left 0
		top 0
		width 100%
		height 100%
		background url("./images/mask.png")
		z-index 0
	&.zoom-show
		display block
		visibility visible
		-webkit-mask-image url("./images/mask-bj.png")
		-webkit-mask-repeat no-repeat
		-webkit-mask-position center center
		-webkit-mask-size 300%
		-webkit-animation circle_zoom 1.2s ease-in
@keyframes circle_zoom {
	0% {
		opacity: 0;
		-webkit-mask-size: 30%;
	}

	40% {
		opacity: 0.6;
		-webkit-mask-size: 60%;
	}

	100% {
		opacity: 1;
		-webkit-mask-size: 300%;
	}
}
</style>
<template>
<div class="header-banner-outer">
	<div
		class="header-banner"
		:style="{
			backgroundImage: `url(${photography.imgSrc})`
		}"
		:class="[
			photographyLoaded ? 'zoom-show' : ''
		]"
	>
		<slot/>
		<div class="photograghy-author">
			<a :href="photography.htmlSrc" target="_blank">{{photography.title}} By:@{{photography.author}}</a>
		</div>
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
		let startTime = new Date().getTime()
		this.photography = this.photoGraphaList[this.photoGraphaIndex]

		let nextIndex = this.photoGraphaIndex + 1
		if (nextIndex >= this.photoGraphaList.length) {
			nextIndex = 0
		}
		this.$emit('nextIndex', nextIndex)
		loadImg(this.photography.imgSrc, () => {
			let spendTime = new Date().getTime() - startTime
			setTimeout(() => {
				this.photographyLoaded = true
			}, 1200)
		})
	}
}
</script>
