<style lang="scss" scoped>
.comments-send-box {
  display: flex;
  padding: 20px;
  background: #fff;
}
.comments-send-box .side {
  width: 50px;
  margin-right: 20px;
}
.comments-send-box .side .avatar {
  width: 40px;
  height: 40px;
  margin: 0 auto 5px;
  border-radius: 8px;
  background: no-repeat center #333;
  background-size: cover;
}
.comments-send-box .side .name {
  text-align: center;
  font-size: 12px;
  word-break: break-all;
}
.comments-send-box .main {
  flex-grow: 1;
}
.comments-send-box .input-content {
  position: relative;
  border: 1px solid #d7dfe4;
}
.comments-send-box .input-content:before {
  content: "";
  position: absolute;
  display: block;
  width: 12px;
  height: 12px;
  top: 15px;
  left: -7px;
  border: 1px solid #d7dfe4;
  border-width: 0 0 1px 1px;
  background: #fff;
  transform: rotate(45deg);
}
.comments-send-box .placeholder {
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 15px;
  line-height: 20px;
  font-size: 14px;
  color: #a6a6a6;
  cursor: text;
  background: #fff;
  transition: 0.15s;
}
.comments-send-box .placeholder small {
  font-size: 13px;
  color: #ddd;
}
.comments-send-box textarea {
  box-sizing: border-box;
  display: block;
  width: 100%;
  padding: 4px 10px;
  margin: 0;
  border: none;
  resize: none;
  font-family: inherit;
  line-height: 24px;
  font-size: 14px;
  color: #333;
}
.comments-send-box textarea:focus {
  outline: none;
  border-color: #fa0;
}
.comments-send-box .footer {
  height: 0;
  overflow: hidden;
  transition: 0.2s;
}
.comments-send-box .footer button {
  margin-top: 10px;
}
.comments-send-box.active .placeholder {
  opacity: 0;
  visibility: hidden;
}
.comments-send-box.active .footer {
  height: 50px;
}
@media screen and (max-width: 600px) {
  .comments-send-box {
    display: block;
    padding: 13px;
  }
  .comments-send-box .side {
    display: flex;
    width: 100%;
    margin-bottom: 10px;
    align-items: center;
  }
  .comments-send-box .side .avatar {
    width: 30px;
    height: 30px;
    margin: 0 10px 0 0;
  }
  .comments-send-box .input-content:before {
    top: -5px;
    left: 13px;
    width: 8px;
    height: 8px;
    border-width: 1px 0 0 1px;
  }
}
</style>
<template>
<div class="comments-send-box" :class="[(isStartInput || content.length) ? 'active' : 'default']">
	<div class="side" @click="setUserDataVisible = !setUserDataVisible">
		<div class="avatar"
			:style="{
				backgroundImage: `url(${userData.avatar})`
			}"
		></div>
		<div class="name">{{userData.username || '燕过留名'}}</div>
	</div>
	<div class="main">
		<setUserData
			v-if="setUserDataVisible"
			:data="userData"
			@confirm="onSetUserDataSuccess"
		/>
		<template v-else>
		<div class="input-content">
			<textarea
				cols="30"
				rows="3"
				ref="textarea"
				@blur="isStartInput = false"
				v-model="content"
			></textarea>
			<div class="placeholder" @click="startInput">评论屌一点，BUG少一点 ！<br><small>支持 Markdown 哦 ！</small></div>
		</div>
		<div class="footer">
			<Button
				type="primary"
				:disabled="content.length === 0"
				@click="submit"
			>发布</Button>
		</div>
		</template>
	</div>
</div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import setUserData from './set-user-data.vue'
import { getUserInfo } from './data'
import type { UserData } from './data'

const props = defineProps<{
	cid: string
	replyForID?: string
	replyForUsername?: string
}>()

const emit = defineEmits<{ (e: 'sendSuccess'): void }>()

const content = ref('')
const isStartInput = ref(false)
const userData = ref<UserData>({
	username: '',
	email: '',
	blog: '',
	avatar: ''
})
const setUserDataVisible = ref(false)
const textarea = ref<HTMLTextAreaElement | null>(null)

function startInput () {
	isStartInput.value = true
	textarea.value && textarea.value.focus()
}

function getUserData () {
	getUserInfo().then(user => {
		userData.value = user || ({} as UserData)
	})
}

function onSetUserDataSuccess (data: UserData) {
	setUserDataVisible.value = false
	userData.value = data
}

function submit () {
	if (!userData.value.username || userData.value.username.length === 0) {
		setUserDataVisible.value = true
		return
	}
	const data: any = {
		cid: props.cid,
		content: content.value,
		user: userData.value
	}
	if (props.replyForID) {
		data.reply_for_id = props.replyForID
		data.content = `@${props.replyForUsername} ${data.content}`
	}
	fetch('/api/comments/0', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
		.then(response => response.json())
		.then(() => {
			content.value = ''
			emit('sendSuccess')
		})
}

onMounted(() => {
	getUserData()
})
</script>
