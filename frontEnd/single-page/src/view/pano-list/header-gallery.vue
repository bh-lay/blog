<style lang="scss" scoped>
.header-gallery {
  background: #333;
  height: 100%;
}
</style>
<template>
<div class="header-gallery" ref="rootEl"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ClinderPanorama from './clinder-panorama'
import imageUrl from './meizhimen.jpg'

const emit = defineEmits<{ (e: 'pano-ready'): void }>()

const rootEl = ref<HTMLElement | null>(null)
let clinderPanorama: ClinderPanorama | null = null

onMounted(() => {
	if (!rootEl.value) {
		return
	}
	clinderPanorama = new ClinderPanorama({
		panoramaUrl: imageUrl,
		element: rootEl.value,
		onInit: () => {
			emit('pano-ready')
		}
	})
})

onBeforeUnmount(() => {
	clinderPanorama?.destroy()
})
</script>
