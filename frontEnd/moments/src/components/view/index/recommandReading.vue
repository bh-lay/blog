<style lang="stylus" rel="stylesheet/stylus" scoped>
.list
	min-height 120px
	padding 15px 0
	a
		display block
		padding 5px 5px
		text-decoration none
		strong
			display block
			line-height 18px
			font-size 14px
			color #454c54
		span
			line-height 14px
			font-size 12px
			color #abb3ba
		&:hover
			strong
				text-decoration underline
</style>
<template>
	<div class="list">
		<a
			v-for="(item, index) in postList"
			:key="index"
			:href="item.url | urlPrefix"
		>
			<strong>{{item.title}}</strong>
			<span>{{item.author}}</span>
		</a>
	</div>
</template>

<script>
export default {
	name: 'post-list',
	components: {},
	data () {
		return {
			postList: [
				{
					title: '记一次「随意」的照片赠送',
					url: 'https://zhuwenlong.com/blog/article/5c36ba26b95a0e17952cffd6',
					author: '朱文龙'
				},
				{
					title: '720云产品发布会小记',
					url: 'https://zhuwenlong.com/blog/article/5c36ba26b95a0e17952cffd6',
					author: '剧中人'
				},
				{
					title: 'JavaScript数字前补技巧JavaScript数字前补0小技巧',
					url: 'https://zhuwenlong.com/blog/article/5c36ba26b95a0e17952cffd6',
					author: '朱文龙'
				},
				{
					title: '合肥GDG酱油之行',
					url: 'https://zhuwenlong.com/blog/article/5c36ba26b95a0e17952cffd6',
					author: '剧中人'
				},
				{
					title: '网速/流量实时监测logo设计',
					url: 'https://zhuwenlong.com/blog/article/5c36ba26b95a0e17952cffd6',
					author: '朱文龙'
				},
				{
					title: '拿什么拯救我拙劣的摄影水平',
					url: 'https://zhuwenlong.com/blog/article/5c36ba26b95a0e17952cffd6',
					author: '朱文龙'
				},
				{
					title: 'JavaScript数字前补0小技巧',
					url: 'https://zhuwenlong.com/blog/article/5c36ba26b95a0e17952cffd6',
					author: '剧中人'
				}
			]
		}
	},
	created () {
	}
}
</script>
