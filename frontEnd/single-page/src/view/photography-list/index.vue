<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
<template>
<layout
  :intro="intro"
	:thirdProfile="thirdProfile"
	:postList="postList"
	:isLoading="isLoading"
>
	<template slot="profile-icon">
		<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<path d="M270.6 688.6c-13-28.4-13.8-36.6 14.8-46.2 51.2-16 16 18.4 86.4 98.4h0.6v-187.8c2.4-100.4 88-184.4 195.4-184.4 107.8 0 195.4 87 195.4 193.6 0 126.8-121.6 226.4-257 186.6-21-8.4-4.2-63.4 17-57.2 106 0 178.8-20.2 178.8-128.8 0-122-154.2-179.2-233.8-89.2-47 52.8-35.2 84.2-35.2 315.2 101.4 62 236.6 44 320.8-40.2 49.6-49.6 77-116 77-186 0-70.4-27.6-136.4-77.6-186.6-49.6-49.6-115.6-77-186.6-77s-137.6 27.6-187 77c-0.6 0.6-32 33-42.4 47.8l-1 1.2c-6.6 9.4-12.6 18.2-40.2 12.2-13.8-3.4-28.6-11.6-28.6-23.6V40c0-10 7.8-21 21-21h482.6c16.6 0 16.6 23.2 16.6 30.2 0 7.8 0 30.2-16.6 30.2H324.6v265.8h0.6c208.4-219.6 565.6-72 565.6 217.8 0 356.2-489.6 440.6-620.2 125.6z m126.6-521.6c-1 8.4 9.2 49 29.2 41.2C676 113.2 832 289 845.2 289c9.6 0 45.6-30.6 28.6-45.6-186.4-178-469-114-476.6-76.4zM850 829.4C630 1049.2 252 951 186 621c0-24.4-60.8-14.8-57.8 6.6 48 346.8 492 513.8 763.2 242.6 13.8-15.6-25.2-56.8-41.4-40.8zM491.2 613.2c0 8 8.6 14.6 11 17 6 6 12.2 8.8 17 8.8 7.6 0 5.2 0.4 44.6-39 39.2 38.6 38.2 39 44.6 39 10.8 0 37-20.8 21.4-36.4L595.2 568l36.4-36.4c12.6-13.6-20.2-43.6-32.4-31.4L563.4 536c-37.2-37.6-36.8-39-43-39-10 0-36 23.4-24.8 34.6L532 568c-36.2 35.8-40.8 38.4-40.8 45.2z"></path>
		</svg>
	</template>
</layout>
</template>

<script>
import layout from '@/components/sns-page-layout/index.vue'
export default {
	name: 'labs-page',
	components: {layout},
	data () {
		return {
			intro: '摄影是小剧为数不多的爱好之一，这里仅仅是收藏一些还能看的过去的照片，作品托管在图虫。',
			thirdProfile: {
				title: '图虫',
				url: 'https://bh-lay.tuchong.com/?from=bh-lay'
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
			fetch('/api/photography/list?act=get_list', {
				method: 'GET'
			})
				.then(response => response.json())
				.then(data => {
					data.post_list.forEach(function (item) {
						item.url += '?from=bh-lay'
						item.thumb = (item.images && item.images.length) ? item.images[0].source.g : (item.title_image ? item.title_image.url : '')
						item.desc = item.excerpt
						item.like = item.favorites
					})
					this.postList = data.post_list
				})
				.catch(() => {})
				.then(() => {
					this.isLoading = false
				})
		}
	}
}
</script>
