<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../assets/stylus/variable.styl"
.archive-list
	max-width 640px
	margin 0 auto 20px
	padding 20px 20px 40px
.archive-title
	line-height 1.5em
	margin-bottom 20px
	border-bottom 1px solid #bdc6ca
	text-indent 10px
	font-size 16px
	color #414f58
.archive-item
	margin-bottom 30px
	.caption
		display flex
		justify-content space-between
		margin-bottom 10px
		a
			font-size 16px
		span
			font-size 14px
			color #8f9aa3
	p
		margin 0
		color #636f79
</style>
<template>
<div class="archive-list" v-loading="isLoading">
	<div ref="scrollMark" class="archive-title">
		Archives
	</div>
	<div
		class="archive-item"
		v-for="item in list"
		:key="item.id"
	>
		<div class="caption">
			<router-link
				:to="'/blog/'+ item.id"
				:title="item.title"
				class="link"
			>{{item.title}}</router-link>
			<span>{{item.time_show | timeFormat}}</span>
		</div>
		<p>{{item.intro}}</p>
	</div>
	<Pagination
		:total="page.total"
		:size="page.pageItemCount"
		:current.sync="page.pageIndex"
	/>
</div>
</template>

<script>

export default {
	name: 'blogPageArchives',
	components: {},
	data () {
		return {
			page: {
				total: 0,
				tag: '',
				pageItemCount: 15,
				pageIndex: parseInt(this.$route.query.page) || 1
			},
			list: [],
			getListTimer: null,

			replyMode: false,
			isLoading: false
		}
	},
	computed: {
		tag () {
			return this.$route.query.tag || ''
		}
	},
	mounted () {
		this.getList()
	},
	methods: {
		getList () {
			this.$refs.scrollMark.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'nearest'
			})
			this.isLoading = true
			clearTimeout(this.getListTimer)
			this.getListTimer = setTimeout(() => {
				this.forceGetList()
					.then(() => {
						this.isLoading = false
					})
			})
		},
		forceGetList () {
			let skip = (this.page.pageIndex - 1) * this.page.pageItemCount
			return fetch(`/api/blog?skip=${skip}&limit=${this.page.pageItemCount}&tag=${this.tag}`)
				.then(response => response.json())
				.then(data => {
					this.page.total = data.count
					this.list = data.list
				})
				.catch(() => {})
		},
		replacePath () {
			let query = {
				page: this.page.pageIndex
			}
			if (this.tag) {
				query.tag = this.tag
			}
			this.$router.replace({
				path: '/blog/',
				query
			})
		}
	},
	watch: {
		'$route.query.tag' () {
			this.page.pageIndex = 1
			this.getList()
		},
		'page.pageIndex' () {
			this.replacePath()
			this.getList()
		}
	}
}
</script>
