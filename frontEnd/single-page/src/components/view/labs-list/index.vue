<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
<template>
<layout
  :intro="intro"
	:thirdProfile="thirdProfile"
	:postList="postList"
>
</layout>
</template>

<script>
import layout from '@/components/sns-page-layout/index.vue'
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
			postList: []
		}
	},
	created () {
		this.getList()
	},
	methods: {
		getList () {
			fetch('/api/labs?limit=20', {
				method: 'GET'
			})
				.then(response => response.json())
				.then(data => {
					data.list.forEach(function (item) {
						item.desc = item.intro
						item.url = '/labs/' + item.name
						item.star = item.github.stargazers_count
						item.fork = item.github.forks_count
					})
					this.postList = data.list
				})
		}
	}
}
</script>
