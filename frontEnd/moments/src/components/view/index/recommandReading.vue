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
			postList: []
		}
	},
	created () {
		fetch('/api/moment/cache/recommandReading', {
			method: 'GET'
		})
			.then(response => response.json())
			.then(({content}) => {
				this.postList = content
			})
	}
}
</script>
