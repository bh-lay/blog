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
			intro: '以下作品无特殊说明均由小剧拍摄并制作完成，作品托管在720云。',
			thirdProfile: {
				title: '720yun',
				url: 'https://720yun.com/u/19023widcyv'
			}
		}
	},
	created () {
	},
	methods: {
	}
}
</script>
