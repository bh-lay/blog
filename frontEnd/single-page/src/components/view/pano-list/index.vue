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
			intro: '以下作品无特殊说明均由小剧拍摄并制作完成，作品托管在720云。',
			thirdProfile: {
				title: '720yun',
				url: 'https://720yun.com/u/19023widcyv'
			},
			postList: []
		}
	},
	created () {
		this.getList()
	},
	methods: {
		getList () {
			fetch('/ajax/pano/list?act=get_list', {
				method: 'GET'
			})
				.then(response => response.json())
				.then(data => {
					data.data.list.forEach(function (item) {
						let thumb = `https://ssl-thumb.720static.com/@${item.property.thumbUrl}?imageMogr2/thumbnail/560`
						item.title = item.property.name
						item.desc = item.property.remark
						item.url = `http://720yun.com/t/${item.property.pid}?from=bh-lay`
						item.thumb = '/img-robber/' + btoa(thumb + '-https://720yun.com')
						item.pv = item.pvCount
						item.like = item.likeCount
					})
					this.postList = data.data.list
				})
		}
	}
}
</script>
