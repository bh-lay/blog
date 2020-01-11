<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
@import "~@/assets/stylus/mixin.styl"

.index-about-backend
  padding 12em 0 20em
  line-height 1.8em
  text-align center
  color #000
  background #fff
  .nodeJS-logo
    width 90px
    height 120px
    margin 0 auto 1em
    background url("./images/nodejs-icon.png")
  .language
    p
      color #80bd01
      margin-bottom .5em
      line-height 50px
      font-size 2.6em
  .frameworks
    p
      height 30px
      line-height 30px
      &:nth-child(1)
        margin-bottom .5em
        font-size 1.5em
        color #555
      &:nth-child(2)
        max-width 400px
        margin auto
        background #555
        color #fff
    a
      padding-left .5em
      color #80bd01
      &:hover
        text-decoration underline
</style>
<template>
<section class="index-about-backend">
	<div class="language">
		<div class="nodeJS-logo"></div>
		<p>NODEJS强力驱动</p>
	</div>
	<div class="frameworks">
		<p>无耻地没有使用以下框架</p>
		<p>express hexo bones rrestjs koa hapi<a href="https://github.com/bh-lay/blog/">博客源码</a></p>
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
