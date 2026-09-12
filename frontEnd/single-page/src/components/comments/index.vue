<style lang="scss" scoped>
.send-box {
  margin-bottom: 20px;
  box-shadow: 0 0 2px rgba(0,0,0,0.2);
}
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
<script setup lang="ts">
import { ref } from 'vue'
import SendBox from './send-box.vue'
import List from './list.vue'

defineProps<{
	cid: string
}>()

const commentsList = ref<InstanceType<typeof List> | null>(null)

function sendSuccess () {
	commentsList.value && commentsList.value.refresh()
}
</script>
