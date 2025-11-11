<style lang="scss" scoped>
.header-banner-outer {
  height: 100%;
  min-height: 200px;
  overflow: hidden;
  background: #eee;
}
.header-banner {
  position: relative;
  height: 100%;
  background: no-repeat center center #f4f1ec;
  background-size: auto 100%;
  visibility: hidden;
  background-size: cover;
}
.header-banner .photograghy-author {
  position: absolute;
  right: 10px;
  bottom: 10px;
  opacity: 0.6;
  transition: 0.4s;
}
.header-banner .photograghy-author a {
  font-size: 12px;
  color: #fff;
  text-shadow: 1px 1px 1px #000, 0 0 5px rgba(0,0,0,0.5);
}
.header-banner .photograghy-author a:hover {
  text-decoration: underline;
}
.header-banner:hover .photograghy-author {
  opacity: 1;
}
.header-banner:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: url("./images/mask.png");
  z-index: 0;
}
.header-banner.zoom-show {
  display: block;
  visibility: visible;
  mask-repeat: no-repeat;
  mask-position: center center;
  animation: circle_zoom 1.2s ease-in;
}
@-moz-keyframes circle_zoom {
  0% {
    mask-image: radial-gradient(circle, #000 10%, transparent 60%);
    opacity: 0;
    mask-size: 40%;
  }
  100% {
    mask-size: 400%;
  }
}
@-webkit-keyframes circle_zoom {
  0% {
    mask-image: radial-gradient(circle, #000 10%, transparent 60%);
    opacity: 0;
    mask-size: 40%;
  }
  100% {
    mask-size: 400%;
  }
}
@-o-keyframes circle_zoom {
  0% {
    mask-image: radial-gradient(circle, #000 10%, transparent 60%);
    opacity: 0;
    mask-size: 40%;
  }
  100% {
    mask-size: 400%;
  }
}
@keyframes circle_zoom {
  0% {
    mask-image: radial-gradient(circle, #000 10%, transparent 60%);
    opacity: 0;
    mask-size: 40%;
  }
  100% {
    mask-size: 400%;
  }
}
</style>
<template>
<div class="header-banner-outer">
	<div
		class="header-banner navigation-shadow"
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
import { loadImg } from '@/common/js/node-utils.js'

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
			}, 1200 - spendTime)
		})
	}
}
</script>
