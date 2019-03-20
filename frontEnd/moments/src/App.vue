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
    <router-view class="router-page" />
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
