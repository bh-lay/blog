<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.friend-detail-page
	min-height 800px
	padding $navigation-height + 30px 0 80px
	background #f6f7f9
</style>
<template>
	<div class="friend-detail-page">
		<div class="page-container">
				<div
					class="avatar"
					:style="{
						backgroundImage: `url(${detail.avatar})`
					}"
				>
				</div>
				<div class="title">{{detail.title}}</div>
				<div class="desc">{{detail.discription}}</div>
				<div class="links">
					<a v-if="detail.url" target="_blank" class="blog" :href="detail.url | urlPrefix">博客</a>
					<a
						v-if="detail.github_username"
						target="_blank"
						class="github"
						:href="detail.githubLink | urlPrefix"
					>Github</a>
				</div>
				<ul class="numbers">
					<li>
						<span>查看</span>
						<strong>2123621</strong>
					</li>
					<li>
						<span>引用</span>
						<strong>52</strong>
					</li>
				</ul>
{{$route.params.id}}
		</div>
	</div>
</template>

<script>
export default {
	name: 'friendDetailPage',
	components: {},
	data () {
		return {
			detail: {
				avatar: '',
				title: '',
				discription: '',
				url: '',
				github_username: ''
			}
		}
	},
	created () {
	},
	methods: {
	}
}
</script>
