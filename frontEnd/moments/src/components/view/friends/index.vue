<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.friends-page
		padding-top $navigation-height + 30px
		background #f6f7f9
</style>
<template>
	<div class="friends-page">
		<div class="page-container">
			<friendList
				:firstPage="$route.params.page"
				@page-change="handlePageChange"
			/>
		</div>
	</div>
</template>

<script>
import friendList from './list.vue'
export default {
	name: 'friendListPage',
	components: {friendList},
	data () {
		return {
		}
	},
	created () {
	},
	methods: {
		handlePageChange (pageIndex) {
			this.$router.replace('/post/friends/' + pageIndex)
		}
	}
}
</script>
