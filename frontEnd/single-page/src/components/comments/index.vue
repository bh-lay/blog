<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.send-box
	margin-bottom 20px
</style>
<template>
<div class="comments">
	<SendBox class="send-box" />
	<List
		:cid="cid"
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
	computed: {
	},
	mounted () {
	},
	methods: {
	}
}
</script>
