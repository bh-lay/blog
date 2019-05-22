<style lang="stylus" rel="stylesheet/stylus" scoped>
.tag-list
	display flex
	flex-wrap wrap
	margin 0 -4px
	padding-top 10px
	a
		flex-grow 1
		border 1px solid #e8eaee
		margin 0 4px 6px
		padding 5px 5px
		background #fff
		border-radius 4px
		line-height 14px
		text-align center
		text-decoration none
		font-size 12px
		color #576575
		transition .2s
		&:hover
			border-color #8599ad
</style>
<template>
	<div class="tag-list">
		<router-link
			v-for="(tag, index) in tagList"
			:key="index"
			:to="'/post/?tag=' + tag"
		>{{tag}}</router-link>
	</div>
</template>

<script>
import {getApiData} from '@/assets/js/api.js'

export default {
	name: 'post-list',
	components: {},
	data () {
		return {
			tagList: []
		}
	},
	created () {
		this.getTagList()
	},
	methods: {
		getTagList () {
			getApiData('/blogtag/')
				.then(({list}) => {
					this.tagList = list.map(item => item.name).slice(0, 10)
				})
		}
	}
}
</script>
