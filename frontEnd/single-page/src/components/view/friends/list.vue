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
				:pageIndex.sync="pageIndex"
			/>
		</div>
	</div>
</template>

<script>
import friendList from './list-pagination.vue'
export default {
	name: 'friendListPage',
	components: {friendList},
	data () {
		return {
			pageIndex: 1
		}
	},
	created () {
		this.getParamsFromRoute()
	},
	methods: {
		handleParamChange () {
			if (this.pageIndex && this.pageIndex === 1) {
				this.$router.replace('/friends/')
			} else {
				this.$router.replace('/friends/page/' + this.pageIndex)
			}
		},
		getParamsFromRoute () {
			this.pageIndex = parseInt(this.$route.params.page || 1, 10)
		}
	},
	watch: {
		$route () {
			this.getParamsFromRoute()
		},
		pageIndex () {
			this.handleParamChange()
		}
	}
}
</script>
