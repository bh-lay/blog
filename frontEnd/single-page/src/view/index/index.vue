<style lang="scss" scoped>
/* * 首页 * */
.index-page {
  overflow: hidden;
}
.index-page section {
  position: relative;
  font-size: 14px;
}
.index-about-links {
  padding: 7em 0;
  text-align: center;
  background: #fff;
}
.index-about-links a {
  margin: 0 20px;
}
</style>
<template>
<div class="index-page">
	<aboutMe/>
	<aboutDesign/>
	<aboutBackend/>
	<aboutFriends/>
	<section class="index-about-links">
		<Button href="http://t.bh-lay.com/aboutme/" type="primary" >关于剧中人</Button>
		<Button href="/topic/aboutblog/index.html" target="_blank" >关于小剧客栈</Button>
	</section>
	<Footer />
</div>
</template>

<script>
import aboutMe from './about-me.vue'
import aboutDesign from './about-design.vue'
import aboutBackend from './about-backend.vue'
import aboutFriends from './about-friends.vue'
export default {
	name: 'index-page',
	components: { aboutMe, aboutDesign, aboutBackend, aboutFriends }
}
</script>
