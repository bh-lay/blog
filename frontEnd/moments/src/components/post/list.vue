<style lang="stylus" rel="stylesheet/stylus" scoped>
.post-list
	padding 0 40px 50px
.item
	display flex
	margin-bottom 20px
	.user
		width 60px
		height 60px
		margin-right 20px
		background #444
	.content
		flex-grow 1
		height 200px
		background #eee
</style>
<template>
	<div class="post-list">
		<div
			class="item"
			v-for="(item, index) in postList"
			:key="index"
		>
			<div class="user">
			</div>
			<div class="content">
				<div class="title"></div>
				<div class="cover"></div>
			</div>
		</div>
		{{pageInfo}}
		<pagination
			v-if="!disablePagination"
			:total="pageInfo.total"
			:size="pageInfo.size"
			:current.sync="pageInfo.current"
		/>
	</div>
</template>

<script>
import pagination from '../pagination/index.vue'
export default {
	name: 'post-list',
	props: ['disablePagination', 'firstPage'],
	components: {pagination},
	data () {
		return {
			postList: [1, 1, 1, 1, 1],
			pageInfo: {
				total: 100,
				current: 1,
				size: 10
			}
		}
	},
	created () {
		this.pageInfo.current = parseInt(this.firstPage || 1, 10)
	}
}
</script>
