<style lang="stylus" rel="stylesheet/stylus">
html, body, div
  margin 0
  padding 0
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale

  position relative
  -webkit-touch-callout none
  -webkit-user-select none
  -khtml-user-select none
  -moz-user-select none
  -ms-user-select none
  user-select none
.app-side
  position absolute
  top 20px
  left 20px
  z-index 2
.app-main
  position relative
  background #fff
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.router-fade-enter-active,
.router-fade-leave-active
  position absolute !important
  width 100%
  height 100%
  top 0
  left 0
.router-fade-enter-active
  transition all .5s ease
.router-fade-leave-active
  transition all 1.2s cubic-bezier(1.0, 0.5, 0.8, 1.0)
.router-fade-enter,
.router-fade-leave-to
  opacity 0
.page-container
  width 1200px
  margin auto
.footer
  height 400px
  background #333
</style>
<template>
  <div id="app">
    <Navigation/>
    <div class="app-main">
      <transition name="router-fade">
        <router-view class="router-page" />
      </transition>
    </div>
    <div class="footer">

    </div>
  </div>
</template>

<script>
import './assets/stylus/animation.css'
import Navigation from './components/navigation'
export default {
  name: 'App',
  components: {Navigation}
}
</script>
