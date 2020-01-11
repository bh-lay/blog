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
			intro: '小剧也曾不知天高地厚的造过不少「轮子」，虽然不好用，但却是我成长路上一个个深深浅浅的脚印。',
			thirdProfile: {
				title: 'Github',
				url: 'https://github.com/bh-lay'
			}
		}
	},
	created () {
	},
	methods: {
	}
}
</script>
