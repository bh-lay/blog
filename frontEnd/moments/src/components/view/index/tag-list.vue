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
			:to="'/post/page/1?tag=' + tag"
		>{{tag}}</router-link>
	</div>
</template>

<script>
export default {
	name: 'post-list',
	components: {},
	data () {
		return {
			tagList: ['javascript', '项目管理', 'VUE', '逆向设计', 'route', '响应式', '甘特图', '生活', '游记', '逆向设计逆向设计逆向设计逆向设计']
		}
	},
	created () {
	}
}
</script>
