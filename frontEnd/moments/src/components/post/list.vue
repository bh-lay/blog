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
		width 200px;
		min-height 200px
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
				{{item}}
			</div>
		</div>
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
			postList: [],
			pageInfo: {
				total: 0,
				current: 1,
				size: 10
			}
		}
	},
	created () {
		this.pageInfo.current = parseInt(this.firstPage || 1, 10)
		this.getData()
	},
	methods: {
		getData () {
			let skip = (this.pageInfo.current - 1) * this.pageInfo.size
			let limit = this.pageInfo.size
			fetch(`/api/comments/?skip=${skip}&limit=${limit}`, {
				method: 'GET'
			})
				.then(response => response.json())
				.then(({data = {}}) => {
					let {count, list} = data
					this.postList = list
					this.pageInfo.total = count
				})
		}
	}
}
</script>
