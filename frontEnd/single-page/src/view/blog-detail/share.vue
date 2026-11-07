<style lang="scss" scoped>
.sns-share {
  padding: 40px 0;
}
.sns-share .share-card {
  min-height: 100px;
}
.sns-share .share-card :deep(img) {
  display: block;
  width: 400px;
  max-width: 100%;
  margin: auto;
}
.sns-share p {
  text-align: center;
  color: #67757e;
}
</style>
<template>
<div class="sns-share">
	<div class="share-card" v-loading="isCoverLoaded" ref="cardArea"></div>
	<p>长按或扫描分享给你的好友～</p>
</div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { imgHosting } from '@/filters'

let shareModuleCache: typeof import('./blog-share') | null = null
let shareModuleLoadPromiseCache: Promise<typeof import('./blog-share')> | null = null

function loadShareModuleAndWaitReady () {
	if (shareModuleCache) {
		return Promise.resolve(shareModuleCache)
	}
	if (shareModuleLoadPromiseCache) {
		return shareModuleLoadPromiseCache
	}
	shareModuleLoadPromiseCache = import('./blog-share').then((module) => {
		shareModuleCache = module
		shareModuleLoadPromiseCache = null
		return shareModuleCache
	})
	return shareModuleLoadPromiseCache
}

const props = defineProps<{
	sharedUrl?: string
	cover?: string
	title?: string
	intro?: string
}>()

const isCoverLoaded = ref(false)
const cardArea = ref<HTMLElement | null>(null)

function createSharePop () {
	// 异步引入分享模块
	loadShareModuleAndWaitReady()
		.then(module => {
			const { createShareCard } = module || {}
			const coverUrl = imgHosting(props.cover || '', 'zoom', 420)
			return createShareCard({
				title: props.title || '',
				intro: props.intro || '',
				url: props.sharedUrl || '',
				coverUrl
			})
		})
		.then(img => {
			isCoverLoaded.value = false
			if (cardArea.value) {
				cardArea.value.innerHTML = ''
				cardArea.value.appendChild(img)
			}
		})
}

createSharePop()
</script>
