<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
</style>
<template>
<div class="articleListPage">
	234
</div>
</template>

<script>

const prefixBlogList = list => {
	list = list || []

	let now = new Date().getTime()
	list.forEach(item => {
		// 三个月内的博文都算新闻章
		item.is_new = (now - item.time_show) / (1000 * 60 * 60 * 24) < 90
	})

	return list
}
export default {
	name: 'blogPageArchives',
	components: {},
	data () {
		return {
			page: {
				skip: 0,
				tag: '',
				limit: 20,
				count: Infinity
			},
			list: [],
			isLoading: false
		}
	},
	computed: {
		tag () {
			return this.$route.query.tag || ''
		}
	},
	mounted () {
		this.loadMore()
	},
	methods: {
		refresh () {
			this.page.skip = 0
			this.list = []
			this.loadMore()
			this.$el.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'nearest'
			})
		},
		loadMore () {
			if (this.page.skip >= this.page.count) {
				return
			}
			this.isLoading = true
			fetch(`/api/blog?skip=${this.page.skip}&limit=${this.page.limit}&tag=${this.tag}`, {
				method: 'GET'
			})
				.then(response => response.json())
				.then(data => {
					this.page.count = data.count
					this.page.skip += this.page.limit
					let blogList = prefixBlogList(data.list)
					this.list = this.list.concat(blogList)
				})
				.catch(() => {})
				.then(() => {
					this.isLoading = false
				})
		}
	},
	watch: {
		$route () {
			this.refresh()
		}
	}
}
</script>
