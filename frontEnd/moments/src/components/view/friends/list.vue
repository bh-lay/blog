<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.friend-list
	.list
		display flex
		flex-wrap wrap
		margin 0 -10px
		& > i
			flex-grow 1
			width 260px
			height 0
			margin 0 10px
	.item
		display flex
		flex-direction column
		flex-grow 1
		width 260px
		height 450px
		margin 0 10px 20px
		background #fff
		box-shadow 1px 1px 3px 0 #e0e4eb
		transition: all .3s ease-in-out
		.avatar
			width 100px
			height 100px
			margin 30px auto 15px
			border-radius 100%
			background no-repeat center center #333
			background-size contain
		.title
			height 24px
			margin-bottom 10px
			line-height 24px
			font-weight bold
			text-align center
			font-size 18px
			color #2e3338
		.desc
			padding 10px 26px
			height 50px
			flex-grow 1
			font-size 14px
			color #8f96a3
			overflow hidden
		.links
			height 80px
			text-align center
			a
				margin 0 .5em
				font-size 14px
				text-decoration underline
		.numbers
			display flex
			justify-content center
			height 40px
			margin 0
			padding 0 0 30px
			list-style none
			li
				width 80px
				text-align center
				span
					display block
					height 20px
					font-size 13px
					color #8f96a3
				strong
					display block
					height 20px
					font-weight normal
					font-size 16px
					color #2e3338

		&:hover
			box-shadow: 3px 3px 30px #c1c9d7
</style>
<template>
	<div class="friend-list">
		<div class="list">
			<div
				class="item"
				v-for="(item, index) in friendsList"
				:key="index"
			>
				<div
					class="avatar"
					:style="{
						backgroundImage: `url(${item.avatar})`
					}"
				>
				</div>
				<div class="title">{{item.title}}</div>
				<div class="desc">{{item.discription}}</div>
				<div class="links">
					<a v-if="item.url" target="_blank" class="blog" :href="item.url | urlPrefix">博客</a>
					<a
						v-if="item.github_username"
						target="_blank"
						class="github"
						:href="item.githubLink | urlPrefix"
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
			</div>
			<i></i><i></i><i></i><i></i><i></i>
		</div>
		<pagination
			:total="pageInfo.total"
			:size="pageInfo.size"
			:current.sync="pageInfo.current"
		/>
	</div>
</template>

<script>
import pagination from '@/components/pagination/index.vue'
export default {
	name: 'friendsList',
	components: {pagination},
	data () {
		return {
			friendsList: [],
			pageInfo: {
				total: 0,
				current: 1,
				size: 24
			}
		}
	},
	created () {
		this.getData()
	},
	methods: {
		getData () {
			let skip = (this.pageInfo.current - 1) * this.pageInfo.size
			let limit = this.pageInfo.size
			fetch(`/api/moment/friend/?skip=${skip}&limit=${limit}`, {
				method: 'GET'
			})
				.then(response => response.json())
				.then(({count, list}) => {
					list.forEach(item => {
						if (item.github_username) {
							item.githubLink = 'https://github.com/' + item.github_username
						} else {
							item.githubLink = ''
						}
					})
					this.friendsList = list
					this.pageInfo.total = count
				})
		}
	},
	watch: {
		'pageInfo.current' () {
			this.getData()
			this.$emit('page-change', this.pageInfo.current)
		}
	}
}
</script>
