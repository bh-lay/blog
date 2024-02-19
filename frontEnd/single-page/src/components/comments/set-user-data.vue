<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../assets/stylus/variable.styl"
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
@media screen and (max-width $max-mobile-width)
	.comments-set-user-data
		.title
			display none
		.list
			flex-wrap wrap
			.item:first-child
				width 100%
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
			<input type="text" placeholder="昵称" maxlength="15" v-model="userData.username">
		</div>
		<div class="item">
			<div class="label">Email</div>
			<input type="text" placeholder="mail@bh-lay.com" maxlength="50" v-model="userData.email">
		</div>
		<div class="item">
			<div class="label">Blog</div>
			<input type="text" placeholder="https://bh-lay.com" maxlength="50" v-model="userData.blog">
		</div>
	</div>
	<Button type="primary" size="small" @click="confirm">确定</Button>
</div>
</template>
<script>
import md5 from 'md5'
import {getUserInfo, setUserInfo, defaultAvatar} from './data.js'

function gravatar (input) {
	return `https://gravatar.kuibu.net/avatar/${md5(input)}?s=100`
}

export default {
	name: 'comments-set-user-data',
	props: {
		data: {
			type: Object,
			default () {
				return {
					username: '',
					email: '',
					blog: '',
					avatar: ''
				}
			}
		}
	},
	data () {
		return {
			content: '',
			isStartInput: false,
			userData: {
				username: '',
				email: '',
				blog: '',
				avatar: ''
			}
		}
	},
	mounted () {
		for (let key in this.userData) {
			this.userData[key] = this.data[key]
		}
	},
	methods: {
		confirm () {
			this.userData.avatar = this.userData.email ? gravatar(this.userData.email) : defaultAvatar
			setUserInfo(this.userData)
			this.$emit('confirm', Object.assign({}, this.userData))
		}
	}
}
</script>
