<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.index-main
	background #fff
	border 1px solid #fff
	border-width 1px 0
.index-main-body
	display flex
	min-height 600px
	.index-sidebar
		width 150px
		margin-left -1000px
		padding-left 1000px
		padding-top $navigation-height + 30px
		padding-right 30px
		border-right 1px solid #e0e6eb
		background #f6f7f9
	.index-content
		flex-grow 1
		padding-top $navigation-height + 30px
	.index-sidebar-secondary
		width 200px
		padding 30px 0 50px 30px
</style>
<template>
	<div class="post-page">
		<div class="index-main">
			<div class="page-container">
				<div class="index-main-body">
					<div class="index-sidebar">
					</div>
					<div class="index-content">
						<div class="tag-editor" v-if="tag">
							标签：{{tag}} <router-link to="/post/">x</router-link>
						</div>
						<postList
							:pageIndex.sync="pageIndex"
							:tag="tag"
						/>
					</div>
					<div class="index-sidebar-secondary">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import postList from '@/components/post/list.vue'
export default {
	name: 'postPage',
	components: {postList},
	data () {
		return {
			pageIndex: 1,
			tag: ''
		}
	},
	created () {
		this.getParamsFromRoute()
	},
	methods: {
		handleParamChange () {
			if (this.pageIndex && this.pageIndex === 1) {
				this.$router.replace('/post/')
			} else {
				this.$router.replace('/post/page/' + this.pageIndex)
			}
		},
		getParamsFromRoute () {
			this.tag = this.$route.query.tag
			this.pageIndex = parseInt(this.$route.params.page, 10) || 1
		}
	},
	watch: {
		$route () {
			this.getParamsFromRoute()
		},
		pageIndex () {
			this.handleParamChange()
		},
		tag () {
			this.handleParamChange()
		}
	}
}
</script>
