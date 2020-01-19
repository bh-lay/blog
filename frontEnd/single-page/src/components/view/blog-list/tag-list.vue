<style lang="stylus" rel="stylesheet/stylus" scoped>
.tag-list
	display flex
	flex-wrap wrap
	margin 0 -5px
	padding 12px 0 8px
	a
		flex-grow 1
		max-width 200px
		margin 0 5px 6px
		padding 8px 5px
		background #fff
		border 1px solid #e8eaee
		border-radius 4px
		line-height 14px
		text-align center
		text-decoration none
		font-size 12px
		color #576575
		transition .2s
		&:hover
			border-color #8599ad
		&.router-link-exact-active
			border-color #576575
			background #576575
			color #fff
			cursor default
</style>
<template>
	<div class="tag-list">
		<router-link to="/blog/" >全部</router-link>
		<router-link
			v-for="(tag, index) in tagList"
			:key="index"
			:to="'/blog/?tag=' + tag"
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
