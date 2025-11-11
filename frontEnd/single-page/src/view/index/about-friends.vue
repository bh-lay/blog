<style lang="scss" scoped>
.index-about-friends {
  padding: 7em 0;
  background: #27a3ca;
  background-image: -webkit-gradient(linear, left top, right bottom, color-stop(0.5, #2a97e4), color-stop(1, #21b3ac));
  text-align: center;
}
.index-about-friends a {
  display: inline-block;
  width: 320px;
  height: 120px;
  border-radius: 8px;
  margin: 10px 20px;
  background: #bee0f4;
  box-shadow: 2px 2px 4px -2px rgba(0,0,0,0.4), 0 0 10px rgba(0,0,0,0.2);
  text-align: center;
  transition: 0.4s;
}
.index-about-friends a:hover {
  box-shadow: 2px 2px 10px rgba(0,0,0,0.4);
  background: #fff;
}
.index-about-friends strong {
  display: block;
  padding-top: 30px;
  line-height: 30px;
  font-size: 22px;
  font-weight: normal;
  color: #21282c;
}
.index-about-friends span {
  display: block;
  line-height: 30px;
  font-size: 14px;
  color: #124c6d;
}
</style>
<template>
<section class="index-about-friends">
	<a href="/directories" target="_blank">
		<strong>剧中人的朋友圈</strong>
		<span>汇聚小剧身边的小伙伴</span>
	</a>
	<a href="//e.bh-lay.com" target="_blank">
		<strong>小剧起始页</strong>
		<span>前端工作小帮手</span>
	</a>
</section>
</template>

<script>
export default {
	name: 'index-about-friends',
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
