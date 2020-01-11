<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
<template>
<layout
  :intro="intro"
	:thirdProfile="thirdProfile"
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
			}
		}
	},
	created () {
	},
	methods: {
	}
}
</script>
