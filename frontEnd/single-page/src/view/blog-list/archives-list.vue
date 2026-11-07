<style lang="scss" scoped>
.archive-list {
  max-width: 640px;
  margin: 0 auto 20px;
  padding: 20px 20px 40px;
}
.archive-title {
  line-height: 1.5em;
  margin-bottom: 20px;
  border-bottom: 1px solid #bdc6ca;
  text-indent: 10px;
  font-size: 16px;
  color: #414f58;
}
.archive-item {
  margin-bottom: 30px;
}
.archive-item .caption {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.archive-item .caption a {
  font-size: 16px;
}
.archive-item .caption span {
  font-size: 14px;
  color: #8f9aa3;
}
.archive-item p {
  margin: 0;
  color: #636f79;
}
</style>
<template>
<div class="archive-list" v-loading="isLoading">
	<div ref="scrollMark" class="archive-title">
		Archives
	</div>
	<div
		class="archive-item"
		v-for="item in list"
		:key="item.id"
	>
		<div class="caption">
			<router-link
				:to="'/blog/'+ item.id"
				:title="item.title"
				class="link"
			>{{item.title}}</router-link>
			<span>{{ timeFormat(item.time_show) }}</span>
		</div>
		<p>{{item.intro}}</p>
	</div>
	<Pagination
		:total="page.total"
		:size="page.pageItemCount"
		v-model:current="page.pageIndex"
	/>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { timeFormat } from '@/ui-library/filters'

const route = useRoute()
const router = useRouter()

const page = ref({
	total: 0,
	tag: '',
	pageItemCount: 15,
	pageIndex: parseInt(String(route.query.page)) || 1
})
const list = ref<any[]>([])
const scrollMark = ref<HTMLElement | null>(null)
let getListTimer: ReturnType<typeof setTimeout> | null = null
const isLoading = ref(false)

const tag = computed(() => (route.query.tag as string) || '')

function getList () {
	scrollMark.value && scrollMark.value.scrollIntoView({
		behavior: 'smooth',
		block: 'center',
		inline: 'nearest'
	})
	isLoading.value = true
	if (getListTimer) clearTimeout(getListTimer)
	getListTimer = setTimeout(() => {
		forceGetList()
			.then(() => {
				isLoading.value = false
			})
	})
}

function forceGetList () {
	const skip = (page.value.pageIndex - 1) * page.value.pageItemCount
	return fetch(`/api/blog?skip=${skip}&limit=${page.value.pageItemCount}&tag=${tag.value}`)
		.then(response => response.json())
		.then(data => {
			page.value.total = data.count
			list.value = data.list
		})
		.catch(() => {})
}

function replacePath () {
	const query: any = {
		page: page.value.pageIndex
	}
	if (tag.value) {
		query.tag = tag.value
	}
	router.replace({
		path: '/blog/',
		query
	})
}

onMounted(() => {
	getList()
})

watch(() => route.query.tag, () => {
	page.value.pageIndex = 1
	getList()
})

watch(() => page.value.pageIndex, () => {
	replacePath()
	getList()
})
</script>
