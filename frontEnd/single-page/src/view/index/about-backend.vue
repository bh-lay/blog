<style lang="scss" scoped>
.index-about-backend {
  padding: 12em 0 20em;
  line-height: 1.8em;
  text-align: center;
  color: #000;
  background: #fff;
}
.index-about-backend .nodeJS-logo {
  width: 90px;
  height: 120px;
  margin: 0 auto 1em;
  background: url("./images/nodejs-icon.png");
}
.index-about-backend .language p {
  color: #80bd01;
  margin-bottom: 0.5em;
  line-height: 50px;
  font-size: 2.6em;
}
.index-about-backend .frameworks p {
  height: 30px;
  line-height: 30px;
}
.index-about-backend .frameworks p:nth-child(1) {
  margin-bottom: 0.5em;
  font-size: 1.5em;
  color: #2f3746;
}
.index-about-backend .frameworks p:nth-child(2) {
  max-width: 400px;
  margin: auto;
  background: #2f3746;
  color: #979eaa;
}
.index-about-backend .frameworks a {
  padding-left: 0.5em;
  color: #accc66;
}
.index-about-backend .frameworks a:hover {
  text-decoration: underline;
}
</style>
<template>
<section class="index-about-backend">
	<div class="language">
		<div class="nodeJS-logo"></div>
		<p>NODEJS强力驱动</p>
	</div>
	<div class="frameworks">
		<p>基于少量类库实现服务端框架</p>
		<p>path-to-regexp、formidable、request、juicer ...<a href="https://github.com/bh-lay/blog/" target="_blank">博客源码</a></p>
	</div>
</section>
</template>

<script>
export default {
	name: 'index-about-backend',
	data () {
		return {
		}
	}
}
</script>
