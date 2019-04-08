<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.summary-count
	flex-grow 1
	display flex
	justify-content space-around
	align-items center
	width 200px
	border 1px solid #e0e6eb
	background #fff
	.item
		text-align center
		.count
			padding-left 8px
			strong
				margin-right 5px
				font-size 28px
				font-weight 300
				color #2e3038
			span
				font-size 14px
				color #8f93a3
		.title
			color #8f93a3
</style>
<template>
	<div class="summary-count">
		<div
			class="item"
			v-for="(item, index) in summary"
			:key="index"
		>
			<div class="count">
				<strong>{{item.count}}</strong><span>{{item.unit}}</span>
			</div>
			<div class="title">{{item.label}}</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'index-summary',
	data () {
		return {
			summary: []
		}
	},
	created () {
		this.getList()
	},
	methods: {
		getList () {
			fetch('/api/moment/cache/summary', {
				method: 'GET'
			})
				.then(response => response.json())
				.then(({content}) => {
					this.summary = content
				})
		}
	}
}
</script>
