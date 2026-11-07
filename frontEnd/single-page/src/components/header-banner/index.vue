<style lang="scss" scoped>
.header-banner-outer {
  height: 100%;
  min-height: 200px;
  overflow: hidden;
}
.header-banner {
  position: relative;
  height: 100%;
  background: no-repeat center center;
  background-size: auto 100%;
  visibility: hidden;
  background-size: cover;
}
.header-banner .photograghy-author {
  position: absolute;
  right: 20px;
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
.header-banner.gray-mask:before {
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
		class="header-banner"
		:style="{
			backgroundImage: `url(${photography.imgSrc})`
		}"
		:class="[
			photographyLoaded ? 'zoom-show' : '',
      mask ? 'gray-mask' : '',
      navigationShadowVisible ? 'navigation-shadow' : ''
		]"
	>
		<slot/>
		<div v-if="authorVisible" class="photograghy-author">
			<a :href="photography.htmlSrc" target="_blank">{{photography.title}} By:@{{photography.author}}</a>
		</div>
	</div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { loadImg } from '@/common/ts/node-utils'

interface Photography {
	imgSrc?: string
	title?: string
	author?: string
	htmlSrc?: string
}

const props = withDefaults(defineProps<{
	mask?: boolean
	navigationShadowVisible?: boolean
	authorVisible?: boolean
	photoGraphaList?: Photography[]
	photoGraphaIndex?: number
}>(), {
	mask: true,
	navigationShadowVisible: true,
	authorVisible: true,
	photoGraphaList: () => [],
	photoGraphaIndex: 0
})

const emit = defineEmits<{ (e: 'nextIndex', index: number): void }>()

const photographyLoaded = ref(false)
const photography = ref<Photography>({})

const startTime = new Date().getTime()
photography.value = props.photoGraphaList[props.photoGraphaIndex] || {}

let nextIndex = props.photoGraphaIndex + 1
if (nextIndex >= props.photoGraphaList.length) {
	nextIndex = 0
}
emit('nextIndex', nextIndex)
loadImg(photography.value.imgSrc || '', () => {
	const spendTime = new Date().getTime() - startTime
	setTimeout(() => {
		photographyLoaded.value = true
	}, 1200 - spendTime)
})
</script>
