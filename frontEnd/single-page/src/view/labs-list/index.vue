<style lang="scss" scoped>
.labs-list-pager {
  background: #383736;
}
.labs-list-header {
  position: relative;
  height: 600px;
  min-height: 32.6vw;
}
.labs-hero-section {
  display: flex;
  flex-direction: row-reverse;
  padding: 150px 20px 0 0;
  .labs-hero-wording {
	width: 500px;
	text-align: right;
	color: #2b211d;
	h1 {
		margin: 0 0 0.2em;
		font-size: 60px;
		font-weight: 800;
		text-shadow: 5px 5px rgba(165, 160, 151, 0.5);
	}
	p {
		margin: 0 0 3em;
		font-size: 18px;
		font-weight: 500;
		text-shadow: 1px 1px rgba(165, 160, 151, 0.5);
	}
  }
}

.post-list {
  min-height: 400px;
  margin: 0 -8px;
  padding: 40px 0;
  display: flex;
  flex-wrap: wrap;
}
.post-list .post-item,
.post-list > i {
  width: 360px;
  flex-grow: 1;
  margin: 0 8px 16px;
}
.post-list > i {
  display: block;
  height: 0;
  margin-bottom: 0;
  padding: 0;
  line-height: 0;
  font-size: 0;
}
</style>
<template>
<div class="labs-list-pager">
	<div class="labs-list-header">
		<headerBanner
			:photoGraphaList="[{imgSrc: headerBg,title: '小剧书房',author: '剧中人'}]"
			:photoGraphaIndex="0"
			:mask="false"
			:authorVisible="false"
			:navigationShadowVisible="false"
			@nextIndex="() => {}"
		>
		<Container class="labs-hero-section">
			<div class="labs-hero-wording">
				<h1>小剧实验室</h1>
				<p>小剧也曾不知天高地厚的造过不少「轮子」，虽然不好用<br/>却也是我成长路上一个个深深浅浅的脚印</p>
				<div class="button">
					<Button href="https://github.com/bh-lay" target="_blank" type="primary" size="large">Github</Button>
				</div>
			</div>
		</Container>
	</headerBanner>
	</div>
	<LaysWorkbench />
	<Container>
		
		<div class="post-list" v-loading="isLoading">
			<Item
				v-for="item in postList"
				:key="item.id"
				:post="item"
			/>
			<i /><i /><i /><i /><i /><i />
		</div>
	</Container>
	<Footer />
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import headerBanner from '@/components/header-banner/index.vue'
import LaysWorkbench from './lays-workbench.vue'
import Item from './item.vue'
import headerBg from './images/hero-bg.jpg'

const thirdProfile = ref({
	title: 'Github',
	url: ''
})
const postList = ref<any[]>([])
const isLoading = ref(false)

function getList () {
	isLoading.value = true
	fetch('/api/labs?limit=20', {
		method: 'GET'
	})
		.then(response => response.json())
		.then(data => {
			data.list.forEach(function (item: any) {
				// item.thumb = imgHosting(item.cover)
				// item.desc = item.intro
				// item.url = '/labs/' + item.name
				// item.star = item.github.stargazers_count
				// item.fork = item.github.forks_count
			})
			postList.value = data.list
		})
		.catch(() => {})
		.then(() => {
			isLoading.value = false
		})
}

onMounted(() => {
	getList()
})
</script>
