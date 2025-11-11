<style lang="scss" scoped>
.comments .caption {
  padding: 0.5em 1em;
  box-shadow: 0 0 2px #aaa;
  height: 24px;
  line-height: 24px;
  font-weight: bold;
  font-size: 15px;
  color: #414f58;
}
.comments .content {
  min-height: 200px;
}
.side-comments-item {
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
}
.side-comments-item .cover {
  width: 50px;
}
.side-comments-item .cover img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background: #eee;
}
.side-comments-item .main {
  flex-grow: 1;
  width: 200px;
}
.side-comments-item .main h4 {
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  color: #414f58;
}
.side-comments-item .main h4 small {
  opacity: 0.7;
  font-weight: normal;
}
.side-comments-item .main p {
  margin: 0;
  padding: 0.5em 0 0;
  font-size: 12px;
  color: #888;
  word-break: break-word;
  line-height: 1.4em;
  max-height: 4.2em;
  overflow: hidden;
}
.side-comments-item:hover {
  background: #fafafa;
  color: inherit;
}
.side-comments-item.router-link-exact-active {
  cursor: default;
}
</style>
<template>
<div class="comments">
	<div class="caption">最新评论</div>
	<div class="content" v-loading="isLoading">
		<router-link
			v-for="item in list"
			:key="item._id"
			:to="item.url"
			class="side-comments-item"
		>
			<div class="cover">
				<img v-lazy :src="item.user.avatar || defaultAvatar" >
			</div>
			<div class="main">
				<h4>{{item.user.username}}<small>0:21 1-21</small></h4>
				<p>{{item.content}}</p>
			</div>
		</router-link>
	</div>
</div>
</template>

<script>
import CommentsSendBox from '@/components/comments/send-box.vue'
import CommentsList from '@/components/comments/list.vue'
import {defaultAvatar} from '@/components/comments/data.js'
export default {
	name: 'latest-comments',
	props: ['list', 'isLoading'],
	data () {
		return {
			defaultAvatar
		}
	},
	created () {
	},
	methods: {
	}
}
</script>
