<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.comments-set-user-data
	padding 10px
	background #414548
	.title
		display flex
		justify-content space-between
		align-items center
		margin-bottom 8px
		strong
			font-size 15px
			color #fff
		span
			font-size 12px
			color #8c9297
	.list
		display flex
		margin 0 -5px 10px
		.item
			flex-grow 1
			margin 0 5px
		.label
			height 18px
			line-height 14px
			font-size 12px
			color #8c9297
		input
			display block
			box-sizing border-box
			width 100%
			height 30px
			margin 0
			padding 0 10px
			border none
			color #454e54
			transition .2s
			&:focus
				outline none
				background #d7d9db
</style>
<template>
<div class="comments-set-user-data">
	<div class="title">
		<strong>报上名来</strong>
		<span>邮箱仅用于gravatar头像，必要时与您沟通之用！</span>
	</div>
	<div class="list">
		<div class="item">
			<div class="label">尊姓大名</div>
			<input type="text" placeholder="昵称">
		</div>
		<div class="item">
			<div class="label">Email</div>
			<input type="text" placeholder="mail@bh-lay.com">
		</div>
		<div class="item">
			<div class="label">Blog</div>
			<input type="text" placeholder="http://bh-lay.com">
		</div>
	</div>
	<Button type="primary" size="small" @click.native="confirm">确-定</Button>
</div>
</template>
<script>
import {getUserInfo} from './data.js'

export default {
	name: 'comments-set-user-data',
	data () {
		return {
			content: '',
			isStartInput: false,
			userData: {}
		}
	},
	mounted () {
		// getUserInfo()
		// 	.then(user => {
		// 		console.log('user', user)
		// 		this.userData = user || {}
		// 	})
	},
	methods: {
		confirm () {
			this.$emit('confirm')
		}
	}
}
</script>
