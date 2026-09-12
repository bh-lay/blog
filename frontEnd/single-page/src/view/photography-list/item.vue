<style lang="scss" scoped>
.potography-item {
  position: relative;
}
.potography-item img {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.potography-item .potography-info {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  opacity: 0;
  transition: 0.3s;
}
.potography-item .potography-info .title {
  padding: 10px 15px;
  font-size: 16px;
  color: #fff;
}
.potography-item .potography-info .desc {
  padding: 10px 15px;
  font-size: 14px;
  color: #fff;
  opacity: 0.7;
}
.potography-item:hover .potography-info {
  opacity: 1;
}
</style>

<template>
	<div
		class="potography-item"
		:style="{
			flexBasis: `calc(var(--base-width) * ${ratio})`,
			aspectRatio: ratio
		}"
	>
		<img class="photo" v-lazy :src="printImageUrl" />
		<a class="potography-info" :href="post.url" target="_blank">
			<div class="title">{{ post.title }}</div>
			<div class="desc">{{ post.excerpt }}</div>
		</a>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
	post?: any
}>(), {
	post: () => ({})
})

const printImageData = computed(() => {
	const printImage = (props.post?.images || [])[0]
	if (printImage) {
		return {
			width: printImage.width,
			height: printImage.height,
			url: printImage.source?.l || ''
		}
	}
	const titleImage = props.post.title_image || {}
	return {
		width: titleImage.width,
		height: titleImage.height,
		url: titleImage.url
	}
})

const printImageUrl = computed(() => printImageData.value.url)
const ratio = computed(() => printImageData.value.width / printImageData.value.height)
</script>
