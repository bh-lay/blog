<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"

.sns-share
	padding 6em 0 2em
	text-align center
	.share-card
		min-height 200px
		padding 20px
		:global(img)
			width 400px
			max-width 100%
			box-shadow 2px 2px 4px rgba(0, 0, 0, .1), 2px 2px 15px rgba(0, 0, 0, .1)
</style>
<template>
<div class="sns-share">
	<div class="share-card" v-loading="isCoverLoaded" ref="cardArea"></div>
</div>
</template>
<script>
import filters from '@/filters/index.js'

export default {
	name: 'blogShare',
	props: {
		blogID: {
			type: String
		},
		cover: {
			type: String
		},
		title: {
			type: String
		},
		intro: {
			type: String
		}
	},
	data () {
		return {
			isCoverLoaded: false
		}
	},
	created () {
		this.createSharePop()
	},
	methods: {
		createSharePop () {
			require.ensure(['./blog-share.js'], () => {
				// 异步引入分享模块
				let {createShareCard} = require('./blog-share.js')
				let coverUrl = filters.imgHosting(this.cover, {
					type: 'zoom',
					width: 420
				})
				createShareCard({
					title: this.title,
					intro: this.intro,
					url: 'http://bh-lay.com/blog/' + this.blogID,
					coverUrl
				})
					.then(img => {
						this.isCoverLoaded = false
						this.$refs.cardArea.appendChild(img)
					})
			})
		}
	}
}
</script>
