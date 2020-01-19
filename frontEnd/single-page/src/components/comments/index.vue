<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.send-box
	margin-bottom 20px
	box-shadow 0 0 2px rgba(0, 0, 0, 0.2)
</style>
<template>
<div class="comments">
	<SendBox
		class="send-box"
		:cid="cid"
		@sendSuccess="sendSuccess"
	/>
	<List
		:cid="cid"
		ref="commentsList"
	/>
</div>
</template>
<script>
import SendBox from './send-box.vue'
import List from './list.vue'

export default {
	name: 'comments-section',
	components: {
		SendBox,
		List
	},
	props: {
		cid: {
			type: String,
			required: true
		}
	},
	data () {
		return {
		}
	},
	methods: {
		sendSuccess () {
			this.$refs.commentsList.refresh()
		}
	}
}
</script>
