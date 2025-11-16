<style lang="scss" scoped>
@use "../../common/styles/variables" as *;
.article-toc-btn-for-mobile {
  display: none;
  :deep i {
    width: 18px;
    right: 12px;
		&:nth-child(2) {
			width: 12px;
		}
  }
}
@media screen and (min-width: $max-mobile-width) and (max-width: $pad-portrait-width) {
  .article-toc-btn-for-mobile {
    display: block;
    position: absolute;
    right: -24px;
    top: 6px;
  }
}
@media screen and (max-width: $max-mobile-width) {
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

<script>
import LineIconTrigger from "./line-icon-trigger.vue"

export const tocVisibleHashKey = "#open-toc-for-mobile"

export default {
  components: { LineIconTrigger },
  props: {
    active: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    isArticlePage() {
      return this.$route.name === "blogDetail"
    },
    isActive() {
      if (!this.isArticlePage) {
        return false
      }
      return this.$route.hash === tocVisibleHashKey
    }
  },
	methods: {
    toggleDisplay() {
      this.$router.replace({
        path: this.$route.path,
        query: this.$route.query,
        hash: this.isActive ? '' : tocVisibleHashKey
      });
    }
	},
}
</script>
