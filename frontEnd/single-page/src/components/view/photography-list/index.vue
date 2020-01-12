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
			intro: '摄影是小剧为数不多的爱好之一，这里仅仅是收藏一些还能看的过去的照片，作品托管在图虫。',
			thirdProfile: {
				title: '图虫',
				url: 'https://bh-lay.tuchong.com/?from=bh-lay'
			},
			postList: []
		}
	},
	created () {
		this.getList()
	},
	methods: {
		getList () {
			fetch('/ajax/photography/list?act=get_list', {
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
		}
	}
}
</script>
