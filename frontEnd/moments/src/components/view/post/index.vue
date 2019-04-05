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
		.tag-list
			.title
				padding 5px 15px
				font-size 14px
				font-weight bold
				color #454a54
				background #eeeff1
			.list
				padding 10px 10px
				a
					display flex
					justify-content space-between
					padding 5px 0
					align-items center
					text-decoration none
					strong
						padding-right 10px
						word-break break-all
						font-weight normal
						font-size 14px
						color #8f96a3
					span
						font-size 16px
						color #c7cad1
					&.active
						strong
							font-weight bold
							color #2662d9
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
						<div class="tag-list">
							<div class="title">标签分类</div>
							<div class="list">
								<router-link to="/post/" :class="tag === '' ? 'active' : ''">
									<strong>全部</strong>
								</router-link>
								<router-link
									v-for="item in tagList"
									:key="item.name"
									:to="'/post/?tag=' + item.name"
									:class="[tag === item.name ? 'active' : '']"
								>
									<strong>{{item.name}}</strong>
									<span>{{item.count}}</span>
								</router-link>
							</div>
						</div>
					</div>
					<div class="index-content">
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
			tag: '',
			tagList: []
		}
	},
	created () {
		this.getParamsFromRoute()
		this.getTagList()
	},
	methods: {
		getTagList () {
			fetch('/api/moment/posttags/', {
				method: 'GET'
			})
				.then(response => response.json())
				.then(({list}) => {
					this.tagList = list
				})
		},
		handleParamChange () {
			let tagStr = this.tag ? `?tag=${this.tag}` : ''
			if (this.pageIndex && this.pageIndex === 1) {
				this.$router.replace('/post/' + tagStr)
			} else {
				this.$router.replace('/post/page/' + this.pageIndex + tagStr)
			}
		},
		getParamsFromRoute () {
			this.tag = this.$route.query.tag || ''
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
