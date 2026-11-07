<style lang="scss" scoped>
@use "../../common/styles/variables" as *;
.article-toc-btn-for-mobile {
  display: none;
  :deep(i) {
    width: 18px;
    right: 12px;
		&:nth-child(2) {
			width: 12px;
		}
  }
}
@media screen and (min-width: $pad-landscape-width) and (max-width: $pad-portrait-width) {
  .article-toc-btn-for-mobile {
    display: block;
    position: absolute;
    right: -24px;
    top: 6px;
  }
}
@media screen and (max-width: $pad-landscape-width) {
  .article-toc-btn-for-mobile {
    display: block;
    margin-right: 8px;
  }
}
</style>
<template>
  <line-icon-trigger
    v-if="isArticlePage"
    class="article-toc-btn-for-mobile"
    :active="isActive"
    @toggle-display="toggleDisplay"
  />
</template>

<script lang="ts">
export const tocVisibleHashKey = '#open-toc-for-mobile'
</script>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LineIconTrigger from './line-icon-trigger.vue'

withDefaults(defineProps<{
  active?: boolean
}>(), {
  active: false
})

const route = useRoute()
const router = useRouter()

const isArticlePage = computed(() => route.name === 'blogDetail')
const isActive = computed(() => {
  if (!isArticlePage.value) {
    return false
  }
  return route.hash === tocVisibleHashKey
})

function toggleDisplay() {
  router.replace({
    path: route.path,
    query: route.query,
    hash: isActive.value ? '' : tocVisibleHashKey
  })
}
</script>
