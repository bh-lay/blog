<style lang="scss" scoped>
.comments-list {
  min-height: 400px;
}
.list-empty {
  padding: 20px;
  background: #fff;
}
.list-empty p {
  font-size: 14px;
  color: #8599ad;
}
.list-empty h3 {
  font-size: 18px;
  color: #5c6870;
}
.l-com-item {
  display: flex;
  margin-bottom: 30px;
  cursor: default;
  margin-bottom: 12px;
  padding: 0 20px;
  --comment-border-color: #f7f7fd;
}
.l-com-item:hover {
  --comment-border-color: #dde;
}
.l-com-item .avatar {
  width: 50px;
  height: 50px;
  margin-right: 20px;
  border-radius: 8px;
  overflow: hidden;
  background: #ddd;
}
.l-com-item .avatar img {
  width: 100%;
  height: 100%;
}
@media screen and (max-width: 600px) {
  .l-com-item {
    margin-bottom: 15px;
  }
  .l-com-item .avatar {
    width: 35px;
    height: 35px;
    margin-right: 12px;
  }
}
</style>
<template>
<div class="comments-list" v-loading="isLoading">
	<div ref="scrollMark"></div>
	<div class="list-empty" v-if="list.length == 0 && !isLoading">
		<p>竟然还没有人说过话，好机会来了！</p>
		<h3>写个牛逼哄哄的评论，好么？</h3>
	</div>
	<div
		class="l-com-item"
		v-for="item in list"
		:key="item._id"
	>
		<div class="avatar">
			<img v-lazy :src="item.user.avatar" />
		</div>
		<ItemContent
			:cid="cid"
			:item="item"
			@replySuccess="refresh"
		/>
	</div>
	<Pagination
		:total="page.total"
		:size="page.pageItemCount"
		v-model:current="page.pageIndex"
	/>
</div>
</template>
<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import ItemContent from './item-content.vue'
import { defaultAvatar } from './data'

interface PageState {
	total: number
	pageItemCount: number
	pageIndex: number
}

const props = withDefaults(defineProps<{
	cid: string
	pageIndex?: number
}>(), {
	pageIndex: 1
})

const emit = defineEmits<{ (e: 'update:pageIndex', index: number): void }>()

const page = reactive<PageState>({
	total: 0,
	pageItemCount: 15,
	pageIndex: props.pageIndex || 1
})
const list = ref<any[]>([])
const scrollMark = ref<HTMLElement | null>(null)
let getListTimer: ReturnType<typeof setTimeout> | null = null
const isLoading = ref(false)

watch(() => page.pageIndex, () => {
	scrollMark.value && scrollMark.value.scrollIntoView({
		behavior: 'smooth',
		block: 'center',
		inline: 'nearest'
	})
	emit('update:pageIndex', page.pageIndex)
	getList()
})

function getList () {
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
	const skip = (page.pageIndex - 1) * page.pageItemCount
	return fetch(`/api/comments/?cid=${props.cid}&skip=${skip}&limit=${page.pageItemCount}`)
		.then(response => response.json())
		.then(data => {
			if (skip > data.data.count) {
				page.pageIndex = 1
				return
			}
			data.data.list.forEach(function (item: any) {
				// 若无头像，使用默认头像
				item.user.avatar = item.user.avatar || defaultAvatar
			})
			page.total = data.data.count
			list.value = data.data.list
		})
		.catch(() => {})
}

function refresh () {
	page.pageIndex = 1
	getList()
}

onMounted(() => {
	getList()
})

defineExpose({ refresh })
</script>
