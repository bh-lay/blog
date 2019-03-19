<style lang="stylus" rel="stylesheet/stylus" scoped>
nav-height = 80px
.navigation
  height nav-height
.naigation-body
  position fixed
  width 100%
  height nav-height
  top 0
  left 0
  background #fff
  z-index 10000
.page-title
  padding 20px 0 0
  font-size 24px
  color #aaa
</style>
<template>
  <div class="navigation">
    <div class="naigation-body">
      <div class="page-container">
        <div class="page-title">剧中人的朋友圈</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'navigation',
  data () {
    return {
      trainListVisible: false,
      overviewVisible: false
    }
  }
}
</script>
