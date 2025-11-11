<style lang="scss" scoped>
.header-gallery {
  background: #333;
  height: 100%;
}
</style>
<template>
<div class="header-gallery"></div>
</template>

<script>
import ClinderPanorama from './clinder-panorama'
import imageUrl from './meizhimen.jpg'
export default {
	// functional: true,
	mounted () {
		this.$clinderPanorama = new ClinderPanorama({
			panoramaUrl: imageUrl,
			element: this.$el,
			onInit: () => {
				this.$emit('pano-ready')
			},
		})
	},
	beforeDestroy() {
		this.$clinderPanorama?.destroy()
	},
}
</script>
