<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
@import "~@/assets/stylus/mixin.styl"

/** 首页 **/
.index-page
  overflow hidden
  section
    position relative
    font-size 1rem

.index-about-links {
  padding: 3em 0;
  text-align: center;
  background: #fff;
  .btn {
    margin: 0 20px;
  }
}

</style>
<template>
<div class="index-page">
  <aboutMe />
  <aboutDesign />
  <aboutBackend />
  <aboutFriends />
  <section class="index-about-links">
    <a href="/topic/aboutme/index.html" class="btn focusme">关于剧中人</a>
    <a href="/topic/aboutblog/index.html" class="btn">关于小剧客栈</a>
  </section>
</div>
</template>

<script>
import aboutMe from './about-me.vue'
import aboutDesign from './about-design.vue'
import aboutBackend from './about-backend.vue'
import aboutFriends from './about-friends.vue'
export default {
	name: 'index',
	components: {aboutMe, aboutDesign, aboutBackend, aboutFriends},
	data () {
		return {
		}
	},
	created () {
	},
	methods: {
	}
}
</script>
