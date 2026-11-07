<style lang="scss" scoped>
.comments-set-user-data {
  padding: 10px;
  background: #414548;
}
.comments-set-user-data .title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.comments-set-user-data .title strong {
  font-size: 15px;
  color: #fff;
}
.comments-set-user-data .title span {
  font-size: 12px;
  color: #8c9297;
}
.comments-set-user-data .list {
  display: flex;
  margin: 0 -5px 10px;
}
.comments-set-user-data .list .item {
  flex-grow: 1;
  margin: 0 5px;
}
.comments-set-user-data .list .label {
  height: 18px;
  line-height: 14px;
  font-size: 12px;
  color: #8c9297;
}
.comments-set-user-data .list input {
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 30px;
  margin: 0;
  padding: 0 10px;
  border: none;
  color: #454e54;
  transition: 0.2s;
}
.comments-set-user-data .list input:focus {
  outline: none;
  background: #d7d9db;
}
@media screen and (max-width: 600px) {
  .comments-set-user-data .title {
    display: none;
  }
  .comments-set-user-data .list {
    flex-wrap: wrap;
  }
  .comments-set-user-data .list .item:first-child {
    width: 100%;
  }
}
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
<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import md5 from 'md5'
import { setUserInfo, defaultAvatar } from './data'
import type { UserData } from './data'

function gravatar (input: string) {
	return `https://assets-eu.mofei.life/gravatar/${md5(input)}?s=100`
}

const props = withDefaults(defineProps<{
	data?: UserData
}>(), {
	data: () => ({
		username: '',
		email: '',
		blog: '',
		avatar: ''
	})
})

const emit = defineEmits<{ (e: 'confirm', data: UserData): void }>()

const userData = reactive<UserData>({
	username: '',
	email: '',
	blog: '',
	avatar: ''
})

onMounted(() => {
	for (const key in userData) {
		(userData as any)[key] = (props.data as any)[key]
	}
})

function confirm () {
	userData.avatar = userData.email ? gravatar(userData.email) : defaultAvatar
	setUserInfo(userData)
	emit('confirm', Object.assign({}, userData))
}
</script>
