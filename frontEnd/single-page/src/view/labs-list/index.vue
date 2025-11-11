<style lang="scss" scoped>
</style>
<template>
<layout
	:intro="intro"
	:thirdProfile="thirdProfile"
	:postList="postList"
	:isLoading="isLoading"
>
</layout>
</template>

<script>
import layout from './layout.vue'
// import filters from '@/filters/index.js'

export default {
	name: 'labs-page',
	components: {layout},
	data () {
		return {
			intro: '小剧也曾不知天高地厚的造过不少「轮子」，虽然不好用，但却是我成长路上一个个深深浅浅的脚印。',
			thirdProfile: {
				title: 'Github',
				url: 'https://github.com/bh-lay'
			},
			postList: [],

			isLoading: false
		}
	},
	created () {
		this.getList()
	},
	methods: {
		getList () {
			this.isLoading = true
			fetch('/api/labs?limit=20', {
				method: 'GET'
			})
				.then(response => response.json())
				.then(data => {
					data.list.forEach(function (item) {
						// item.thumb = filters.imgHosting(item.cover)
						// item.desc = item.intro
						// item.url = '/labs/' + item.name
						// item.star = item.github.stargazers_count
						// item.fork = item.github.forks_count
					})
					this.postList = data.list
				})
				.catch(() => {})
				.then(() => {
					this.isLoading = false
				})
		}
	}
}
</script>
