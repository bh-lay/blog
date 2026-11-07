<style lang="scss" scoped>
.tag-list {
  display: flex;
  flex-wrap: wrap;
  height: 30px;
  overflow: hidden;
}
.tag-list button {
  flex-grow: 1;
  max-width: 100px;
  margin: 0 10px 5px 0;
  border-color: #e8eaee;
  color: #576575;
}
.tag-list button:hover {
  border-color: #8599ad;
  color: #576575;
}
.tag-list button.ui-button-primary {
  border-color: #576575;
  background: #576575;
  color: #fff;
  cursor: default;
}
</style>
<template>
	<div class="tag-list" v-loading="isLoading">
		<Button
			@click="switchTag('')"
			size="small"
			:type="!route.query.tag ? 'primary' : 'default'"
		>全部</Button>
		<Button
			v-for="(tag, index) in tagList"
			:key="index"
			:type="route.query.tag === tag ? 'primary' : 'default'"
			size="small"
			@click="switchTag(tag)"
		>{{tag}}</Button>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getApiData } from '@/common/ts/api'

const route = useRoute()
const router = useRouter()

const tagList = ref<string[]>([])
const isLoading = ref(false)

function getTagList () {
	isLoading.value = true
	getApiData('/blogtag/')
		.then(({ list }) => {
			tagList.value = list.map((item: any) => item.name).slice(0, 10)
		})
		.catch(() => {})
		.then(() => {
			isLoading.value = false
		})
}

function switchTag (tag: string) {
	const query: any = {}
	if (route.query.type === 'list') {
		query.type = 'list'
		query.page = 1
	}
	if (tag) {
		query.tag = tag
	}
	router.replace({
		path: '/blog/',
		query
	})
}

onMounted(() => {
	getTagList()
})
</script>
