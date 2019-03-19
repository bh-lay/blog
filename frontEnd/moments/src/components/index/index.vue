<style lang="stylus" rel="stylesheet/stylus" scoped>
.banner
  height 400px
  background #2e3438
.some-tools
  padding 30px 0
  background #f0f1f5
.some-tools-body
  height 300px
  border 1px solid #e0e6eb
  background #fff
.index-main
  background #fff
  border-top 1px solid #fff
.index-main-body
  display flex
  min-height 600px
  .index-sidebar
    width 200px
    margin-left -1000px
    padding-left 1000px
    padding-top 20px
    padding-right 40px
    border-right 1px solid #e0e6eb
    background #f6f7f9
    .ads-1
      height 160px
      background #333
  .index-content
    flex-grow 1
  .index-sidebar-secondary
    width 350px
</style>
<template>
  <div class="index-page">
    <div class="banner">
    </div>
    <div class="some-tools">
      <div class="page-container">
        <div class="some-tools-body"></div>
      </div>
    </div>
    <div class="index-main"></div>
    <div class="page-container">
      <div class="index-main-body">
        <div class="index-sidebar">
          <div class="ads-1"></div>
        </div>
        <div class="index-content">
          <postList />
        </div>
        <div class="index-sidebar-secondary"></div>
      </div>
    </div>
  </div>
</template>

<script>
import postList from './postList.vue'
export default {
  name: 'index',
  components: {postList},
  data () {
    return {
    }
  },
  created () {
  }
}
</script>
