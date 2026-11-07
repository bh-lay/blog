<style lang="scss" scoped>
.bless-page {
  background: #f5f8fa;
}
.bless-header {
  height: 70vh !important;
  min-height: 450px !important;
}
.bless-header .bless-header-content {
  position: absolute;
  top: 20%;
  left: 0;
  width: 100%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bless-header .bless-header-main {
  width: 100%;
  max-width: 700px;
  margin: auto;
  padding: 0 20px;
}
.bless-header h2 {
  height: 1em;
  line-height: 1em;
  margin: 0 0 0.5em;
  text-align: center;
  font-weight: normal;
  font-size: 30px;
  color: #fff;
}
.bless-body {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 0 80px;
  gap: 20px;
}
.bless-body .main-body {
  width: 400px;
  flex: 1;
  flex-basis: auto;
  overflow: auto;
  box-sizing: border-box;
}
.bless-body .main-body .comments-list {
  padding: 20px 0;
  border-radius: 8px;
  background: #fff;
}
.bless-body .bless-sidebar {
  position: relative;
  width: 320px;
}
.bless-body .bless-sidebar .side-card {
  margin-bottom: 20px;
  overflow: hidden;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0,0,0,0.2);
}
@media screen and (max-width: 1024px) {
  .bless-body {
    display: block;
  }
  .bless-body .main-body {
    width: auto;
    margin-bottom: 20px;
  }
  .bless-body .bless-sidebar {
    width: auto;
  }
}
</style>
<template>
<div class="bless-page">
	<headerBanner
		class="bless-header"
		:photoGraphaList="photoGraphaList"
		:photoGraphaIndex="photoGraphaIndex"
		@nextIndex="nextIndex"
	>
		<div class="bless-header-content">
			<div class="bless-header-main">
				<h2>说点啥</h2>
				<CommentsSendBox
					cid="define-1"
					@sendSuccess="sendSuccess"
				/>
			</div>
		</div>
	</headerBanner>
	<Container class="bless-body">
		<div class="main-body">
			<CommentsList
				cid="define-1"
				ref="commentsList"
				v-model:pageIndex="pageIndex"
			/>
		</div>
		<div class="bless-sidebar">
			<Github
				class="side-card"
				:summary="githubSummary"
				:isLoading="isLoading"
			/>
			<Comments
				class="side-card"
				:list="commentList"
				:isLoading="isLoading"
			/>
		</div>
	</Container>
	<Footer />
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import headerBanner from '@/components/header-banner/index.vue'
import CommentsSendBox from '@/components/comments/send-box.vue'
import CommentsList from '@/components/comments/list.vue'
import Github from './github.vue'
import Comments from './comments.vue'
import image1 from './images/1.jpg'
import image2 from './images/2.jpg'

let globalPhotoGraphaIndex = 0

const route = useRoute()
const router = useRouter()

const commentList = ref<any[]>([])
const githubSummary = ref({
	public_repos: 0,
	followers: 0,
	following: 0
})
const pageIndex = ref(parseInt(String(route.query.page), 10) || 1)

const photoGraphaList = [
	{
		imgSrc: image1,
		htmlSrc: 'https://bh-lay.tuchong.com/14431809/#image24933177',
		title: '束河古城',
		author: '剧中人'
	}, {
		imgSrc: image2,
		// htmlSrc: 'https://720yun.com/t/544jOrkvtn0?from=bh-lay',
		title: '崇明黄昏',
		author: '剧中人'
	}
]
const photoGraphaIndex = ref(globalPhotoGraphaIndex)
const isLoading = ref(false)

const commentsList = ref<InstanceType<typeof CommentsList> | null>(null)

function sendSuccess () {
	commentsList.value && commentsList.value.refresh()
}

function getSummary () {
	isLoading.value = true
	fetch('/api/single-page-side')
		.then(response => response.json())
		.then(data => {
			githubSummary.value = data.githubSummary
			commentList.value = data.commentList
		})
		.catch(() => {})
		.then(() => {
			isLoading.value = false
		})
}

function nextIndex (index: number) {
	globalPhotoGraphaIndex = index
}

onMounted(() => {
	getSummary()
})

watch(pageIndex, () => {
	router.replace({
		path: '/bless',
		query: {
			page: pageIndex.value
		}
	})
})
</script>
