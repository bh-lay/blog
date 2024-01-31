<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../assets/stylus/variable.styl"

.sns-share
	padding 40px 0
	.share-card
		min-height 100px
		::v-deep img
			display block
			width 400px
			max-width 100%
			margin auto
	p
		text-align center
		color #67757e
</style>
<template>
<div class="sns-share">
	<div class="share-card" v-loading="isCoverLoaded" ref="cardArea"></div>
	<p>长按或扫描分享给你的好友～</p>
</div>
</template>
<script>
import filters from '@/filters/index.js'

let shareModuleCache = null
let shareModuleLoadPromiseCache = null
function loadShareModuleAndWaitReady() {
	if (shareModuleCache) {
		return Promise.resolve(shareModuleCache)
	}
	if (shareModuleLoadPromiseCache) {
		return shareModuleLoadPromiseCache
	}
	shareModuleLoadPromiseCache = import('./blog-share.js').then((module) => {
		shareModuleCache = module
		shareModuleLoadPromiseCache = null
		return shareModuleCache
	})
	return shareModuleLoadPromiseCache
}
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
			// 异步引入分享模块
			loadShareModuleAndWaitReady()
				.then(module => {
					let { createShareCard } = module || {}
					let coverUrl = filters.imgHosting(this.cover, 'zoom', 420)
					return createShareCard({
						title: this.title,
						intro: this.intro,
						url: '//bh-lay.com/blog/' + this.blogID,
						coverUrl
					})
				})
				.then(img => {
					this.isCoverLoaded = false
					this.$refs.cardArea.innerHTML = ''
					this.$refs.cardArea.appendChild(img)
				})
		}
	}
}
</script>
